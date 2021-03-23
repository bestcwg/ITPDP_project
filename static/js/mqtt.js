const hostText = document.querySelector("#host");
const portText = document.querySelector("#port");
const messagesDiv = document.querySelector("#messages");
const topicText = document.querySelector("#topic");
const latestText = document.querySelector("#latest");

let client;

// Called after form input is processed
function startConnect() {
    // Generate a random client ID
    const clientID = "clientID-" + parseInt(Math.random() * 1000);

    // Fetch the hostname/IP address and port number from the form
    const host = hostText.value;
    const port = portText.value;

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
    });
}

// Called when the client connects
function onConnect() {
    // Fetch the MQTT topic from the form
    const topic = topicText.value;

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
    if (message.destinationName.endsWith("/json")) {
        const data = JSON.parse(payload);
        if (data.hasOwnProperty('id')) {
            latestText.value = data['id'];
        }
    }
    console.log("onMessageArrived: " + payload);
    messagesDiv.innerHTML += `<span>Topic: ${message.destinationName}|${message.payloadString}</span><br/>`;
    updateScroll(); // Scroll to bottom of window
}

// Called when the disconnection button is pressed
function startDisconnect() {
    client.disconnect();
    messagesDiv.innerHTML += "<span>Disconnected</span><br/>";
    updateScroll(); // Scroll to bottom of window
}

// Updates #messages div to auto-scroll
function updateScroll() {
    const element = messagesDiv;
    element.scrollTop = element.scrollHeight;
}