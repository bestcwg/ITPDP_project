const host = "itwot.cs.au.dk";
const port = "8883";
const messagesDiv = document.querySelector("#messages");
const mestempDiv = document.querySelector("#mestemp");
const meshumDiv = document.querySelector("#meshum");
const mespressDiv = document.querySelector("#mespress");
const mesdateDiv = document.querySelector("#mesdate");
const topic = "au681464/alldata";
const numperpage = 20;
var data = new Array();
var pagelist = new Array();
let client;
var pagenumber = 1;
var numofpages = 0;

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
    numofpages = getNumOfPages();
}


function onConnect() {
    // Called when the client connects

    // Subscribe to the requested topic
    client.subscribe(topic);
}

function onConnectionLost(responseObject) {
    // Called when the client loses its connection
    console.log("onConnectionLost: Connection Lost");
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost: " + responseObject.errorMessage);
    }
}

function onMessageArrived(message) {
    // Called when a message arrives
    const payload = message.payloadString;
    if (message.destinationName.endsWith("/alldata")) {
        data = JSON.parse(payload);
        printpage();
        console.log("onMessageArrived: " + payload); 
        numofpages = getNumOfPages();
    }  
}

function printpage() {
    // Prints the page. If the database contains a lot of elements, the page will be slow.
    messagesDiv.innerHTML = new Array();
    var begin = ((pagenumber -1) * numperpage);
    var end = begin + numperpage;
    pagelist = data.slice(begin,end)
    for (i = begin; i < end; i++) {
        if(data.includes(data[i])) {
            messagesDiv.innerHTML += `
                <td> ${data[i][0]} </td>
                <td> ${data[i][1]} </td>
                <td> ${data[i][2]} </td>
                <td> ${data[i][3]} </td>`
        }
    }
    check();
}

// Selects previous page
function pagedown() {
        pagenumber -= 1;
        document.querySelector("#pagenum").innerHTML = `Pagenumber: ${pagenumber}/${getNumOfPages()}`;
        printpage();
        updateScroll();
}

function pageup() {
    // Selects next page
        pagenumber += 1;
        document.querySelector("#pagenum").innerHTML = `Pagenumber: ${pagenumber}/${getNumOfPages()}`;
        printpage();
        updateScroll();
}

function getNumOfPages(){
    // returns number of pages
    return Math.ceil(data.length/ numperpage)
}


function updateScroll() {
    // Updates #messages div to auto-scroll
    const element = messagesDiv;
    element.scrollTop = element.scrollHeight;
}

function fetchData () {
    // Setup request with url yes
    const request = new XMLHttpRequest();
    //const requestURL = 'http://10.250.37.104:7000/getmeasurements';
    const requestURL = 'itwot.cs.au.dk/VM13/opg4b/getmeasurements';

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

function check() {
    // checks if buttons should be active
    document.getElementById("right").disabled = pagenumber == numofpages ? true : false;
    document.getElementById("left").disabled = pagenumber == 1 ? true : false;
}