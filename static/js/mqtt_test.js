const host = "itwot.cs.au.dk";
const port = "8883";
const topic = "learnalize/#";

let client;
let mapAsc = new Map();
let attributeMap = new Map();
attributeMap.set('A', '12334');
attributeMap.set('B', '1233');
attributeMap.set('C', '123234');
attributeMap.set('D', '334');
updateWorkbench();

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
    messageMQTT("/attribute", message, payload)
        
    messageMQTT("/primary", message, payload)
}

function messageMQTT(topic, message, payload) {
    if (message.destinationName.endsWith(topic)) {
        data = JSON.parse(payload);
        if (topic === "/attribute") {
            type = "NOT PRIMARY";
        } else {
            type = "PRIMARY";
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

function mapToObj(map){
    const obj = {}
    for (let [k,v] of map)
        obj[k] = v
    return obj
}

function convertTag(RFID_TAG) {
    const myMap = new Map([['4B008304BA76','A'], ['59001D3A80FE','B'], ['4D006A71FBAD','C'], 
                        ['4D006AB00D9A','D'], ['4D006A6FE5AD','E'], ['59001D35FB8A','F']]);

    return myMap.get(RFID_TAG);
}

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

function updateWorkbench () {
    document.getElementById('checknf').innerHTML = "";
    document.getElementById('workbench').innerHTML = "Scan some attribute blocks and see your table in progress here!";
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

function updateCompleted () {
    attributeMap.forEach (function(value, key) {
        if(value === 'PRIMARY') {
            document.getElementById('workbench').innerHTML += `<img src='/static/gfx/${key}P.png' alt='${key}P'>`;
        }
        else {
            document.getElementById('workbench').innerHTML += `<img src='/static/gfx/${key}.png' alt='${key}'>`;
        }
    });
    attributeMap.clear();
}

function check () {
    //Restraint so that you can't press the platform without any table
    if (attributeMap.size > 0) {
        finishedTable();
        // Hvis det er i 3NF
        if(attributeMap) {
            checknf.style.display = "That is not in 3NF, remember 3NF is 'the key, the whole key, and nothing but the key'";
        }
        else {
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
    else {
        document.getElementById('checknf').innerHTML = "I need a table";
        return true;
    }
}

