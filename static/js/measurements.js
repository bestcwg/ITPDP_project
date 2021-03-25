const host = "itwot.cs.au.dk";
const port = "8883";
const messagesDiv = document.querySelector("#messages");
const topic = "au681464/M5SC0/measurements/json";

let client;

startConnect()

// Called after form input is processed
function startConnect() {
    // Generate a random client ID
    const clientID = "clientID-" + parseInt(Math.random() * 1000);

    // Print output for the user in the messages div
    messagesDiv.innerHTML += `<span>Connecting to: ${host} on port: ${port}</span><br/>`;
    messagesDiv.innerHTML += `<span>Using the following client value: ${clientID}</span><br/>`;

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

    // Print output for the user in the messages div
    messagesDiv.innerHTML += `<span>Subscribing to: ${topic}</span><br/>`;

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
    
    console.log("onMessageArrived: " + payload);
    messagesDiv.innerHTML += `<span>Topic: ${message.destinationName}|${message.payloadString}</span><br/>`;
    updateScroll(); // Scroll to bottom of window
}

// Updates #messages div to auto-scroll
function updateScroll() {
    const element = messagesDiv;
    element.scrollTop = element.scrollHeight;
}