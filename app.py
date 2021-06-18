"""Creates a MQTT aware web site"""
from signal import signal, SIGINT
from sys import exit
import json
from flask import Flask, render_template, request, jsonify
from flask_mqtt import Mqtt
import itwot
import getip
import datablocks as db
import nfcheck

__CONFIG = itwot.config()
app = Flask(__name__)
app.config["MQTT_BROKER_URL"] = "itwot.cs.au.dk"
app.config["MQTT_BROKER_PORT"] = 1883
mqtt = Mqtt(app)


@app.route("/", methods=["POST", "GET"])
@app.route("/start", methods=["POST", "GET"])
def index():
    """Redirects to startpage"""
    return render_template("/index.html", config=__CONFIG)

@app.route("/assignments", methods=["GET", "POST"])
def assignments():
    """Redirects to Assignments"""
    return render_template("html/assignments.html", config=__CONFIG, confirmed_tables=db.take_all())

@app.route("/done", methods=["GET"])
def done():
    """Redirects to donepage"""
    return render_template("html/done.html", config=__CONFIG)

@mqtt.on_connect()
def handle_connect(client, userdata, flags, rc):
    """Handles connection"""
    print("connected to MQTT broker...", end="")
    mqtt.subscribe("learnalize/#")
    print("subscribed")

@mqtt.on_message()
def handle_mqtt_message(client, userdata, message):
    """Handles mqtt message"""
    topic = message.topic
    payload = message.payload.decode()

    if topic.endswith("/attribute"):
        payload = json.loads(payload)
        if "RFID_TAG" in payload:
            print("GOTCHA!")

    if topic.endswith("/check"):
        payload = json.loads(payload)
        keys = []
        for x in payload :
            if payload[x] == 'PRIMARY' :
                keys.append(x)
        
        #adds Functional dependencies in play
        nf = nfcheck.FDs()
        if ('A' in payload and 'B' in payload) :
            nf.addfd(nfcheck.FDs.mkfd('A','B'))
        if ('A' in payload and 'C' in payload) :
            nf.addfd(nfcheck.FDs.mkfd('A','C'))
        if ('A' in payload and 'D' in payload) :
            nf.addfd(nfcheck.FDs.mkfd('A','D'))
        # Adds all scanned keys as FD's to themselves
        #for x in payload :
        #   if payload[x] == 'PRIMARY' :
        #       nf.addfd(nfcheck.FDs.mkfd(x,x))
        # If an attribute has no other FD's, adds one
        for x in payload :
            if payload[x] not in nf.fds :
                nf.addfd(nfcheck.FDs.mkfd(x,x))

        print(keys)
        print('Keys')
        print(nf.keys())
        print('Minimal Cover')
        print(nf.minimalCover())
        print("Is 3nf", nf.is3nf())
        print("Is BCNF", nf.isbcnf())
        print("Complete FD closure")
        for fdc in nf.fdclosure():
            print(''.join(fdc[0]), '->', ''.join(fdc[1]), fdc[2] or '')

        #checks if keys is matching, if they do not it is not in 3nf
        nfkeys = nf.keys()
        print(nfkeys[0])
        for x in keys :
            if (x not in nfkeys[0]) :
                nf_fail()
                print(x)
                print('first check')
                return
        for x in nfkeys[0] :
            if (x not in keys) :
                nf_fail()
                print('check')
                return

        #checks if table is in 3nf  
        if (nf.is3nf()):
            mqtt.publish("learnalize/checkresult", json.dumps('true'))
            mqtt.publish("learnalize/adafruit/weight/state", json.dumps('M'))
            db.store_table(payload)
            db.take_all()
        else:
            nf_fail()
    
    if topic.endswith("/solution"):
        list = db.take_all()
        print(len(list))
        print(list)
        if len(list) == 2:
            table1 = {'A': 'PRIMARY', 'B': '', 'C': '', 'D': '', 'E': 'PRIMARY', 'F': ''}
            table2 = {'A': 'PRIMARY', 'B': 'NOT PRIMARY', 'C': 'NOT PRIMARY', 'D': 'NOT PRIMARY', 'E': '', 'F': ''}

            if (table1 == list[0] and table2 == list[1]) or (table1 == list[1] and table2 == list[0]):
                mqtt.publish("learnalize/donesolution", json.dumps('true'))
                db.reset_database()
            else:
                mqtt.publish("learnalize/donesolution", json.dumps('false')) 

    print(f"Received MQTT on {topic}: {payload}")

            


def handler(signal_received, frame):
    """handles exiting"""
    # Handle any cleanup here
    print("SIGINT or CTRL-C detected. Exiting gracefully")
    mqtt.unsubscribe_all()
    exit(0)

def nf_fail():
    mqtt.publish("learnalize/adafruit/weight/state", json.dumps('B'))
    mqtt.publish("learnalize/checkresult", json.dumps('false'))

if __name__ == "__main__":
    signal(SIGINT, handler)
    app.run(
        debug=__CONFIG["debug"],
        host=getip.get_ip(),
        port=__CONFIG["port"],
        use_reloader=False,
    )
