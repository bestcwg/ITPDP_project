"""Creates a MQTT aware web site"""
from signal import signal, SIGINT
from sys import exit
import json
from flask import Flask, render_template
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
def index():
    return render_template("index.html", config=__CONFIG)

@app.route("/measurements")
def measurements():
    return render_template("measurements.html", config=__CONFIG)

@mqtt.on_connect()
def handle_connect(client, userdata, flags, rc):
    print("connected to MQTT broker...", end="")
    mqtt.subscribe("au681464/#")
    print("subscribed")


@mqtt.on_message()
def handle_mqtt_message(client, userdata, message):
    topic = message.topic
    payload = message.payload.decode()
    if topic.endswith("/json"):
        payload = json.loads(payload)
        if "id" in payload:
            db.store_measurement(topic, payload["id"])
    print(f"Received MQTT on {topic}: {payload}")


# inspired by https://www.devdungeon.com/content/python-catch-sigint-ctrl-c
def handler(signal_received, frame):
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
