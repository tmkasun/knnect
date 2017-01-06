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
                    notifyObject = $.UIkit.notify({
                        message: messageContent,
                        status: 'warning',
                        timeout: 0,
                        pos: 'top-center'
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
        notifyObject = $.UIkit.notify({
            message: message_content,
            status: message_status,
            timeout: ApplicationOptions.constance.NOTIFY_SUCCESS_TIMEOUT,
            pos: 'top-center'
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
    $.UIkit.notify({
        message: 'Connection lost with server!!',
        status: 'danger',
        timeout: ApplicationOptions.constance.NOTIFY_DANGER_TIMEOUT,
        pos: 'top-center'
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

function Alert(type, message, level) {
    this.type = type;
    this.message = message;
    if (level)
        this.level = level;
    else
        this.level = 'info';

    this.notify = function () {
        $.UIkit.notify({
            message: this.level + ': ' + this.type + ' ' + this.message,
            status: 'info',
            timeout: ApplicationOptions.constance.NOTIFY_INFO_TIMEOUT,
            pos: 'bottom-left'
        });
    }
}

function LocalStorageArray(id) {
    if (typeof (sessionStorage) === 'undefined') {
        // Sorry! No Web Storage support..
        return ['speed']; // TODO: fetch this array from backend DB rather than keeping as in-memory array
    }
    if (id === undefined) {
        throw 'Should provide an id to create a local storage!';
    }
    var DELIMITER = ','; // Private variable delimiter
    this.storageId = id;
    sessionStorage.setItem(id, 'speed'); // TODO: <note> even tho we use `sessionStorage` because of this line previous it get overwritten in each page refresh
    this.getArray = function () {
        return sessionStorage.getItem(this.storageId).split(DELIMITER);
    };

    this.length = this.getArray().length;

    this.push = function (value) {
        var currentStorageValue = sessionStorage.getItem(this.storageId);
        var updatedStorageValue;
        if (currentStorageValue === null) {
            updatedStorageValue = value;
        } else {
            updatedStorageValue = currentStorageValue + DELIMITER + value;
        }
        sessionStorage.setItem(this.storageId, updatedStorageValue);
        this.length += 1;
    };
    this.isEmpty = function () {
        return (this.getArray().length === 0);
    };
    this.splice = function (index, howmany) {
        var currentArray = this.getArray();
        currentArray.splice(index, howmany);
        var updatedStorageValue = currentArray.toString();
        sessionStorage.setItem(this.storageId, updatedStorageValue);
        this.length -= howmany;
        // TODO: should return spliced section as array
    };
}