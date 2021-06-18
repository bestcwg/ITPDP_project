const host = "itwot.cs.au.dk";
const port = "8883";
const topic = "learnalize/#";

let client;
let mapAsc = new Map();
let attributeMap = new Map();

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
    messageMQTT("/attribute", message, payload);
        
    messageMQTT("/primary", message, payload);

    messageMQTT("/checkresult", message, payload);

    messageMQTT("/reset", message, payload);

    messageMQTT("/donesolution", message, payload);
}

function messageMQTT(topic, message, payload) {
    if (message.destinationName.endsWith(topic)) {
        data = JSON.parse(payload);
        console.log(data);
        if (topic === "/attribute") {
            type = "NOT PRIMARY";
        } else if (topic === "/primary") {
            type = "PRIMARY";
        } else if (topic === "/checkresult") {
            if (data === 'true') {
                updateCheckedTables();
                clearTable();
                return
            } else {
                return document.getElementById('checknf').innerHTML = "Det er ikke i 3NF";
            }
        } else if (topic === "/reset") {
            deleteFromTable(data["RFID_TAG"]);
            updateWorkbench();
            return
        } else if (topic === "/donesolution") {
            done(data);
            return
        }
        console.log("onMessageArrived: " + payload); 
        mapAsc.set(convertTag(data["RFID_TAG"]), type);
        mapAscc = new Map([...mapAsc.entries()].sort((a, b) => String(a[0].localeCompare(b[0]))));
        attributeMap = new Map([...mapAscc.entries()].sort((a, b) => String(b[1].localeCompare(a[1]))));
        console.log(mapAsc);
        console.log(attributeMap);
        attributeMap.forEach(function(value, key) {
            console.log(key + ' = ' +  value);
        });
        updateWorkbench();
    }
}

function deleteFromTable(data) {
    mapAsc.delete(convertTag(data));
    mapAscc = new Map([...mapAsc.entries()].sort((a, b) => String(a[0].localeCompare(b[0]))));
    attributeMap = new Map([...mapAscc.entries()].sort((a, b) => String(b[1].localeCompare(a[1]))));
}

function mapToObj(map){
    const obj = {}
    for (let [k,v] of map)
        obj[k] = v
    return obj
}

// Converts tags to Letters
function convertTag(RFID_TAG) {
    const myMap = new Map([['4B008304BA76','A'], ['59001D3A80FE','B'], ['4D006A71FBAD','C'], 
                        ['4D006AB00D9A','D'], ['4D006A6FE5AD','E'], ['59001D35FB8A','F']]);

    return myMap.get(RFID_TAG);
}

// Sends a JSON file to MQTT
function finishedTable() {
    messageGet = new Paho.MQTT.Message(JSON.stringify(mapToObj(attributeMap)));
    messageGet.destinationName = "learnalize/check";
    client.send(messageGet);
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

// Updates the Workbench when a new RFID is scanned, or when a table is weighed
function updateWorkbench () {
    document.getElementById('checknf').innerHTML = "";
    document.getElementById('workbench').innerHTML = "Scan nogle attribut blokke og se din tabel tage form her!";
    if (attributeMap.size > 0) {
        document.getElementById('workbench').innerHTML = "";
        attributeMap.forEach (function(value, key) {
            if(value === 'PRIMARY') {
                document.getElementById('workbench').innerHTML += `<img src='/static/gfx/${key}P.png' alt='${key}P'>`;
            }
            else {
                document.getElementById('workbench').innerHTML += `<img src='/static/gfx/${key}.png' alt='${key}'>`;
            }
        });
    }
}

// Updates tbe Completed tables when a table is weighed to be in 3NF
function updateCheckedTables () {
    document.getElementById('checknf').innerHTML = "";
    document.getElementById('workbench').innerHTML = "Scan nogle attribut blokke og se din tabel tage form her!";
    console.log(attributeMap);
    attributeMap.forEach (function(value, key) {
        if(value === 'PRIMARY') {
            document.getElementById('completed').innerHTML += `<img src='/static/gfx/${key}P-kopi.png' alt='${key}P-kopi'>`;
        }
        else {
            document.getElementById('completed').innerHTML += `<img src='/static/gfx/${key}-kopi.png' alt='${key}-kopi'>`;
        }
    });
    document.getElementById('completed').innerHTML += `<br />`;
}

function check() {
    //Restraint so that you can't press the platform without any table
    if (attributeMap.size > 0) {
        finishedTable();
    }
}

function clearTable() {
    mapAsc.clear();
}

/*function done() {
    console.log(state);
    document.getElementById('donefeedback').innerHTML = "";
    state += 1;
    // hardcoded done button function
    if (state > 1) {
        document.getElementById('donebut').style.backgroundColor = "green";
        document.getElementById('donebut').innerHTML = "Næste opgave";
        document.getElementById('donefeedback').style.color = "green";
        document.getElementById('donefeedback').style.fontSize = "40px";
        document.getElementById('donefeedback').innerHTML = "DU KLAREDE DEN!";
    }
    else {
        document.getElementById('donefeedback').innerHTML = "Den oprindelige tabel kan ikke gendannes";
    }
}*/

function done(state) {
    if (state === "true") {
        document.getElementById('donebut').style.backgroundColor = "green";
        document.getElementById('donebut').innerHTML = "Næste opgave";
        document.getElementById('donefeedback').style.color = "green";
        document.getElementById('donefeedback').style.fontSize = "40px";
        document.getElementById('donefeedback').innerHTML = "DU KLAREDE DEN!";
    } else {
        document.getElementById('donefeedback').innerHTML = "Den oprindelige tabel kan ikke gendannes";
    }
}

function checkDone() {
    messageGet = new Paho.MQTT.Message("testdone");
    messageGet.destinationName = "learnalize/solution";
    client.send(messageGet);
}