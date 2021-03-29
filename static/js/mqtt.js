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
var data = [];
let client;

window.addEventListener('load', startConnect());

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

    fetchData();
    if (data.length > 0) {
        printpage();
    }
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
        data = JSON.parse(payload);
        printpage();
        console.log("onMessageArrived: " + payload); 
    }
}

function printpage () {  
    // Prints the page. If the database contains a lot of elements, the page will be slow.
    latesttempDiv.innerHTML = `<span> ${data[0][0][0]}<br/> date: ${data[0][0][3]} </span>`;
    latesthumDiv.innerHTML = `<span> ${data[0][0][1]}<br/> date: ${data[0][0][3]} </span>`;
    latestpressDiv.innerHTML = `<span> ${data[0][0][2]}<br/> date: ${data[0][0][3]} </span>`;
    maximumtempDiv.innerHTML = `<span> ${data[1][0][0]}<br/> date: ${data[1][0][1]} </span>`;
    minimumtempDiv.innerHTML = `<span> ${data[2][0][0]}<br/>date: ${data[2][0][1]} </span>`;
    maximumhumDiv.innerHTML = `<span> ${data[3][0][0]}<br/> date: ${data[3][0][1]} </span>`;
    minimumhumDiv.innerHTML = `<span> ${data[4][0][0]}<br/> date: ${data[4][0][1]} </span>`;
    maximumpressDiv.innerHTML = `<span> ${data[5][0][0]}<br/> date: ${data[5][0][1]} </span>`;
    minimumpressDiv.innerHTML = `<span> ${data[6][0][0]}<br/> date: ${data[6][0][1]} </span>`;
}

function fetchData () {
    // Setup request with url yes
    const request = new XMLHttpRequest();
    const requestURL = 'http://10.250.37.104:7000/getmax';
    //const requestURL = 'https://itwot.cs.au.dk/VM13/opg4b/getmax';

    // When request is loaded
    request.onload = () => {
      if (request.status === 200) {
        // Get data - add to graph and table
        updatedata(request.responseText);
      }
    };

    // Setup and send request
    request.open('GET', requestURL);
    request.setRequestHeader('Accept', 'application/json');
    request.send();
}

function updatedata (startdata) {
    // updates data
    console.log(startdata);
    data = JSON.parse(startdata);
}
