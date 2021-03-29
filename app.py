"""Creates a MQTT aware web site"""
from signal import signal, SIGINT
from sys import exit
import json
from flask import Flask, render_template, request, jsonify
from flask_mqtt import Mqtt
import itwot
import getip
import measurements_db as db

__CONFIG = itwot.config()
app = Flask(__name__)
app.config["MQTT_BROKER_URL"] = "itwot.cs.au.dk"
app.config["MQTT_BROKER_PORT"] = 1883
mqtt = Mqtt(app)


@app.route("/")
@app.route("/home")
def index():
    """Redirects to homepage"""
    return render_template("/index.html", config=__CONFIG, data = db.get_minmaxlatest())

@app.route("/measurements")
def measurements():
    """Redirects to All measurements"""
    return render_template("/html/measurements.html", config=__CONFIG, data=db.get_measurements())

@app.route("/getmeasurements", methods=["GET"])
def getmeasurements():
    if request.method =="GET":
        return jsonify(db.get_measurements())

@app.route("/getmax", methods=["GET"])
def getmax():
    if request.method =="GET":
        return jsonify(db.get_minmaxlatest())

@mqtt.on_connect()
def handle_connect(client, userdata, flags, rc):
    """Handles connection"""
    print("connected to MQTT broker...", end="")
    mqtt.subscribe("au681464/#")
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
            publishall()
    print(f"Received MQTT on {topic}: {payload}")

def publishall():
    """returns all measurements"""
    data = db.get_minmaxlatest()
    mqtt.publish("au681464/data", str(json.dumps(data, default=str)))
    data = db.get_measurements()
    mqtt.publish("au681464/alldata", str(json.dumps(data, default=str)))



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
