const host = "itwot.cs.au.dk";
const port = "8883";
const messagesDiv = document.querySelector("#messages");
const topic = "au681464/M5SC0/measurements/json";
const latesttempDiv = document.querySelector("#latesttemp");
const latesthumDiv = document.querySelector("#latesthum");
const latestpressDiv = document.querySelector("#latestpress");
const minimumtempDiv = document.querySelector("#minimumtemp");
const minimumhumDiv = document.querySelector("#minimumhumidity");
const minimumpressDiv = document.querySelector("#minimumpress");
const maximumtempDiv = document.querySelector("#maximumtemp");
const maximumhumDiv = document.querySelector("#maximumhum");
const maximumpressDiv = document.querySelector("#maximumpress");

let client;

startConnect()

// Called after form input is processed
function startConnect() {
    // Generate a random client ID
    const clientID = "clientID-" + parseInt(Math.random() * 1000);


    // Initialize new Paho client connection
    client = new Paho.MQTT.Client(host, Number(port), clientID);

    // Set callback handlers
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    // Connect the client, if successful, call onConnect function
    client.connect({
        onSuccess: onConnect,
        useSSL: true
    });
}

// Called when the client connects
function onConnect() {

    // Subscribe to the requested topic
    client.subscribe(topic);
}

// Called when the client loses its connection
function onConnectionLost(responseObject) {
    console.log("onConnectionLost: Connection Lost");
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost: " + responseObject.errorMessage);
    }
}

// Called when a message arrives
function onMessageArrived(message) {
    const payload = message.payloadString;
    if (message.destinationName.endsWith("/data")) {
        const data = JSON.parse(payload);
        latesttempDiv.innerHTML = `<span> ${data[0][0]} </span>`;
        //latesthumDiv.value = data['topic'];
        //latestpressDiv.value = data['date'];
        minimumtempDiv.innerHTML += `<span>Topic: ${data[0][2]}</span><br/>`;
        //minimumhumDiv.value = data['topic'];
        //minimumpressDiv.value = data['topic'];
        maximumtempDiv.innerHTML += `<span>Topic: ${data[0][1]}</span><br/>`;
        //maximumhumDiv.value = data['topic'];
        //maximumpressDiv.value = data['topic'];
    }
}
