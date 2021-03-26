const host = "itwot.cs.au.dk";
const port = "8883";
const messagesDiv = document.querySelector("#messages");
const mestempDiv = document.querySelector("#mestemp");
const meshumDiv = document.querySelector("#meshum");
const mespressDiv = document.querySelector("#mespress");
const mesdateDiv = document.querySelector("#mesdate");
const topic = "au681464/latest";

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
    if (message.destinationName.endsWith("/latest")) {
        const data = JSON.parse(payload);
        console.log("onMessageArrived: " + payload);
        messagesDiv.innerHTML += `
        <tr>
            <td> ${data[0][0]} </td>
            <td> ${data[0][1]} </td>
            <td> ${data[0][2]} </td>
            <td> ${data[0][3]} </td>
        </tr>`
    }
}
