const host = "itwot.cs.au.dk";
const port = "8883";
const messagesDiv = document.querySelector("#messages");
const topic = "au681464/M5SC0/measurements/json";
const latesttempText = document.querySelector("#latesttemp");
const latesthumText = document.querySelector("#latesthum");
const latestpressText = document.querySelector("#latestpress");
const minimumtempText = document.querySelector("#minimumtemp");
const minimumhumText = document.querySelector("#minimumhumidity");
const minimumpressText = document.querySelector("#minimumpress");
const maximumtempText = document.querySelector("#maximumtemp");
const maximumhumText = document.querySelector("#maximumhum");
const maximumpressText = document.querySelector("#maximumpress");

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
    if (message.destinationName.endsWith("/data")) {
        const data = JSON.parse(payload);
        latesttempText.innerHTML += `<span> ${data[0][0]} </span>`;
        //latesthumText.value = data['topic'];
        //latestpressText.value = data['date'];
        minimumtempText.innerHTML += `<span>Topic: ${data[0][2]}</span><br/>`;
        //minimumhumText.value = data['topic'];
        //minimumpressText.value = data['topic'];
        maximumtempText.innerHTML += `<span>Topic: ${data[0][1]}</span><br/>`;
        //maximumhumText.value = data['topic'];
        //maximumpressText.value = data['topic'];
    }
    latesttempText.innerHTML = `<span> ${payload[0][0]} </span>`;
    console.log("onMessageArrived: " + payload);
    messagesDiv.innerHTML += `<span>Topic: ${message.destinationName}|${message.payloadString}</span><br/>`;
    updateScroll(); // Scroll to bottom of window
}

// Updates #messages div to auto-scroll
function updateScroll() {
    const element = messagesDiv;
    element.scrollTop = element.scrollHeight;
}