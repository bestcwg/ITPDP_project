const host = "itwot.cs.au.dk";
const port = "8883";
const messagesDiv = document.querySelector("#messages");
const mestempDiv = document.querySelector("#mestemp");
const meshumDiv = document.querySelector("#meshum");
const mespressDiv = document.querySelector("#mespress");
const mesdateDiv = document.querySelector("#mesdate");
const topic = "au681464/alldata";
const numperpage = 20;
var data = [];

let client;
var pagenumber = 1;

window.addEventListener('load', startConnect())

// Evenlisteners for buttons
document.getElementById("left").addEventListener("click",function(){pagedown()});
document.getElementById("right").addEventListener("click",function(){pageup()});

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
}

function dataLoad() {

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
    if (message.destinationName.endsWith("/alldata")) {
        data = JSON.parse(payload);
        printpage();
        console.log("onMessageArrived: " + payload); 
    }  
}

// Prints the page. If the database contains a lot of elements, the page will be slow.
function printpage() {
    messagesDiv.innerHTML = [];
    for (i = (pagenumber + (pagenumber-1)*20); i < (pagenumber*20); i++) {
        if(data.includes(data[i])) {
            messagesDiv.innerHTML += `
                <td> ${data[i][0]} </td>
                <td> ${data[i][1]} </td>
                <td> ${data[i][2]} </td>
                <td> ${data[i][3]} </td>`
        }
    }
}

// Selects previous page
function pagedown() {
    if(pagenumber > 1) {
        pagenumber -= 1;
        document.querySelector("#pagenum").innerHTML = `Pagenumber: ${pagenumber}/${getNumOfPages()}`;
        printpage();
        updateScroll();
    }
}

// Selects next page
function pageup() {
    if(pagenumber < data.length/20) {
        pagenumber += 1;
        document.querySelector("#pagenum").innerHTML = `Pagenumber: ${pagenumber}/${getNumOfPages()}`;
        printpage();
        updateScroll();
    }
}

// returns number of pages
function getNumOfPages(){
    return Math.ceil(data.length/ numperpage)
}

// Updates #messages div to auto-scroll
function updateScroll() {
    const element = messagesDiv;
    element.scrollTop = element.scrollHeight;
}

function fetchData () {
    // Setup request with url
    const request = new XMLHttpRequest();
    const requestURL = 'http://10.250.37.104:7000/getmeasurements';
    //const requestURL = 'itwot.cs.au.dk/VM13/opg4b/getmeasurements';

    // When request is loaded
    request.onload = () => {
      if (request.status === 200) {
        // Get data - add to graph and table
        doSomething(request.responseText);
      }
    };

    // Setup and send request
    request.open('GET', requestURL);
    request.setRequestHeader('Accept', 'application/json');
    request.send();
}

function doSomething (startdata) {
    console.log(startdata);
    data = JSON.parse(startdata);
}
