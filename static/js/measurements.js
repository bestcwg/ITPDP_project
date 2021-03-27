const host = "itwot.cs.au.dk";
const port = "8883";
const messagesDiv = document.querySelector("#messages");
const mestempDiv = document.querySelector("#mestemp");
const meshumDiv = document.querySelector("#meshum");
const mespressDiv = document.querySelector("#mespress");
const mesdateDiv = document.querySelector("#mesdate");
const topic = "au681464/alldata";
var data = [];

let client;

startConnect()
var pagenumber = 1;


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
    data = JSON.parse(payload);
    printpage();
    console.log("onMessageArrived: " + payload);   
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
        document.querySelector("#pagenum").innerHTML = `Pagenumber: ${pagenumber}/${data.length/20}`;
        printpage();
        updateScroll();
    }
}

// Selects next page
function pageup() {
    if(pagenumber < data.length/20) {
        pagenumber += 1;
        document.querySelector("#pagenum").innerHTML = `Pagenumber: ${pagenumber}/${data.length/20}`;
        printpage();
        updateScroll();
    }
}

// Updates #messages div to auto-scroll
function updateScroll() {
    const element = messagesDiv;
    element.scrollTop = element.scrollHeight;
}