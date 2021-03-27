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
pagepage()

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
    pagepage()
}

function pagepage() {
    $(document).ready(function(){
        $('#paging').after('<div id="nav"></div>');
        var rowsShown = 5;
        var rowsTotal = $('#paging tbody tr').length;
        var numPages = rowsTotal/rowsShown;
        for(page = 0;page < numPages;page++) {
            var pageNum = page + 1;
            $('#nav').append('<a href="#" rel="'+page+'">'+pageNum+'</a> ');
        }
        $('#paging tbody tr').hide();
        $('#paging tbody tr').slice(0, rowsShown).show();
        $('#nav a:first').addClass('active');
        $('#nav a').bind('click', function(){
    
            $('#nav a').removeClass('active');
            $(this).addClass('active');
            var currPage = $(this).attr('rel');
            var startItem = currPage * rowsShown;
            var endItem = startItem + rowsShown;
            $('#paging tbody tr').css('opacity','0.0').hide().slice(startItem, endItem).
            css('display','table-row').animate({opacity:1}, 300);
        });
    });
}
