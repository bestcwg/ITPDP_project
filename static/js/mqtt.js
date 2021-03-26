const host = "itwot.cs.au.dk";
const port = "8883";
const topic = "au681464/data";
const latesttempDiv = document.querySelector("#latesttemp");
const latesthumDiv = document.querySelector("#latesthum");
const latestpressDiv = document.querySelector("#latestpress");
const maximumtempDiv = document.querySelector("#maximumtemp");
const minimumtempDiv = document.querySelector("#minimumtemp");
const maximumhumDiv = document.querySelector("#maximumhum");
const minimumhumDiv = document.querySelector("#minimumhum");
const maximumpressDiv = document.querySelector("#maximumpress");
const minimumpressDiv = document.querySelector("#minimumpress");

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
        latesttempDiv.innerHTML = `<span> ${data[0][0][0]}</br> date: ${data[0][0][3]} </span>`;
        latesthumDiv.innerHTML = `<span> ${data[0][0][1]}</br> date: ${data[0][0][3]} </span>`;
        latestpressDiv.innerHTML = `<span> ${data[0][0][2]}</br> date: ${data[0][0][3]} </span>`;
        maximumtempDiv.innerHTML = `<span> ${data[1][0][0]}</br> date: ${data[1][0][1]} </span>`;
        minimumtempDiv.innerHTML = `<span> ${data[2][0][0]}</br> date: ${data[2][0][1]} </span>`;
        maximumhumDiv.innerHTML = `<span> ${data[3][0][0]}</br> date: ${data[3][0][1]} </span>`;
        minimumhumDiv.innerHTML = `<span> ${data[4][0][0]}</br> date: ${data[4][0][1]} </span>`;
        maximumpressDiv.innerHTML = `<span> ${data[5][0][0]}</br> date: ${data[5][0][1]} </span>`;
        minimumpressDiv.innerHTML = `<span> ${data[6][0][0]}</br> date: ${data[6][0][1]} </span>`;
    }
}
