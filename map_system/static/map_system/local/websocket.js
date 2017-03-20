var debugObject; // assign object and debug from browser console, this is for debugging purpose , unless this var is unused
var showPathFlag = false; // Flag to hold the status of draw objects path
var currentSpatialObjects = {};
var selectedSpatialObject; // This is set when user search for an object from the search box
var webSocketURL = ApplicationOptions.constance.WEB_SOCKET_URL;
var websocket;

// Make the function wait until the connection is made...
var waitTime = 1000;
var notifyObject = null;
function waitForSocketConnection(socket, callback) {
    setTimeout(
        function () {
            if (socket.readyState === 1) {
                initializeWebSocket();
                waitTime = 1000;
                console.log("Connection is made");
                if (callback != null) {
                    callback();
                }
                return;

            } else {
                websocket = new WebSocket(webSocketURL);
                waitTime += 400;
                var messageContent = "Retry after " + waitTime / 1000 + " Seconds...";
                if (!notifyObject) {

                    notifyObject = noty({
                        text: messageContent,
                        type: 'warning',
                        dismissQueue: true,
                        progressBar: true,
                        layout: 'top',
                        theme: 'relax',
                    });
                }
                notifyObject.content(messageContent);
                waitForSocketConnection(websocket, callback);
            }

        }, waitTime); // wait 5 milisecond for the connection...
}

var webSocketOnOpen = function () {

    var message_content = 'connection made successfully';
    var message_status = 'success';

    if (!notifyObject) {
        notifyObject = noty({
            text: message_content,
            type: message_status,
            dismissQueue: true,
            timeout: ApplicationOptions.constance.NOTIFY_SUCCESS_TIMEOUT,
            layout: 'top',
            theme: 'relax',
        });
    }
    else {
        notifyObject.content(message_content);
        notifyObject.status(message_status);
        setTimeout(function () {
            notifyObject.close();
            notifyObject = null;
        }, ApplicationOptions.constance.NOTIFY_SUCCESS_TIMEOUT);
    }

};

var webSocketOnError = function (e) {
    console.log('DEBUG: webSocketURL =' + webSocketURL);
    $.UIkit.notify({
        message: ApplicationOptions.locale[ApplicationOptions.locale.type].websocket.errors.connection,
        status: 'danger',
        timeout: ApplicationOptions.constance.NOTIFY_DANGER_TIMEOUT,
        pos: 'top-center'
    });
//    waitForSocketConnection(websocket);
};

var webSocketOnClose = function (e) {
    noty({
        text: 'Connection lost with server!!',
        type: 'error',
        dismissQueue: true,
        progressBar: true,
        timeout: ApplicationOptions.constance.NOTIFY_DANGER_TIMEOUT,
        layout: 'top',
        theme: 'relax',
    });
    waitForSocketConnection(websocket);
};

var webSocketOnMessage = function processMessage(message) {
    // debugger;
    var geoJsonFeature = $.parseJSON(message.data);
    if (geoJsonFeature.id in currentSpatialObjects) {
        var excitingObject = currentSpatialObjects[geoJsonFeature.id];
        excitingObject.update(geoJsonFeature);
    }
    else {
        var receivedObject = new SpatialObject(geoJsonFeature);
        receivedObject.update(geoJsonFeature);
        currentSpatialObjects[receivedObject.id] = receivedObject;
        currentSpatialObjects[receivedObject.id].geoJson.addTo(map);
    }
};

function initializeWebSocket() {
    websocket = new WebSocket(webSocketURL);
    websocket.onmessage = webSocketOnMessage;
    websocket.onclose = webSocketOnClose;
    websocket.onerror = webSocketOnError;
    websocket.onopen = webSocketOnOpen;
}

initializeWebSocket();