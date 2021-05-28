"""Creates a MQTT aware web site"""
from signal import signal, SIGINT
from sys import exit
import json
from flask import Flask, render_template, request, jsonify
from flask_mqtt import Mqtt
import itwot
import getip
import measurements_db as db
import datablocks as test
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
    return render_template("html/assignments.html", config=__CONFIG)

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
    if topic.endswith("/json"):
        payload = json.loads(payload)
        if "temp" and "hum" and "press" in payload:
            db.store_measurement(payload["temp"], payload["hum"], payload["press"])

    if topic.endswith("/attribute"):
        payload = json.loads(payload)
        if "RFID_TAG" in payload:
            print("GOTCHA!")

    if topic.endswith("/check"):
        payload = json.loads(payload)
        nf = nfcheck.FDs()
        if ('A' in payload and 'B' in payload) :
            nf.addfd(nfcheck.FDs.mkfd('A','B'))
        if ('A' in payload and 'C' in payload) :
            nf.addfd(nfcheck.FDs.mkfd('A','C'))
        if ('A' in payload and 'D' in payload) :
            nf.addfd(nfcheck.FDs.mkfd('A','D'))
        
        print('Keys')
        print(nf.keys())
        print('Minimal Cover')
        print(nf.minimalCover())
        print("Is 3nf", nf.is3nf())
        print("Is BCNF", nf.isbcnf())
        print("Complete FD closure")
        for fdc in nf.fdclosure():
            print(''.join(fdc[0]), '->', ''.join(fdc[1]), fdc[2] or '')

        if(nf.is3nf()) :
            mqtt.publish("learnalize/checkresult", str(json.dumps('true', default=str)))
        else :
            mqtt.publish("learnalize/checkresult", str(json.dumps('false', default=str)))
        
    print(f"Received MQTT on {topic}: {payload}")


def handler(signal_received, frame):
    """handles exiting"""
    # Handle any cleanup here
    print("SIGINT or CTRL-C detected. Exiting gracefully")
    mqtt.unsubscribe_all()
    exit(0)


if __name__ == "__main__":
    signal(SIGINT, handler)
    app.run(
        debug=__CONFIG["debug"],
        host=getip.get_ip(),
        port=__CONFIG["port"],
        use_reloader=False,
    )
