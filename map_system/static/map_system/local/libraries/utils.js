/**
 * Created by tmkasun on 1/14/17.
 */

/**
 *
 * @param objectId - Spatial object id , received from websocket focuse and draw the history line for this session
 * from beginning
 * @returns {boolean}
 *
 * TODO: when click on a notification alert ? "Uncaught ReferenceError: KM is not defined "
 */
var handlers = require('./eventHandlers');
var toggled = false;
function focusOnSpatialObject(objectId) {

    var spatialObject = currentSpatialObjects[objectId];// (local)
    if (!spatialObject) {
        $.UIkit.notify({
            message: "Spatial Object <span style='color:red'>" + objectId + "</span> not in the Map!!",
            status: 'warning',
            timeout: ApplicationOptions.constance.NOTIFY_WARNING_TIMEOUT,
            pos: 'top-center'
        });
        return false;
    }
    clearFocus(); // Clear current focus if any
    selectedSpatialObject = objectId; // (global) Why not use 'var' other than implicit declaration http://stackoverflow.com/questions/1470488/what-is-the-function-of-the-var-keyword-and-when-to-use-it-or-omit-it#answer-1471738

    map.setView(spatialObject.marker.getLatLng(), 17, {animate: true}); // TODO: check the map._layersMaxZoom and set the zoom level accordingly

    $('#objectInfo').find('#objectInfoId').html(selectedSpatialObject);
    spatialObject.marker.openPopup();
    if (!toggled) {
        $('#objectInfo').animate({width: 'toggle'}, 100);
        toggled = true;
    }
    getAlertsHistory(objectId);
    spatialObject.drawPath();
    setTimeout(function () {
        createChart();
        chart.load({columns: [spatialObject.speedHistory.getArray()]});
    }, 100);
}


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

function showAlertInMap(alertData) {
    clearFocus();

    var id = $(alertData).attr("data-id");
    var latitude = $(alertData).attr("data-latitude");
    var longitude = $(alertData).attr("data-longitude");
    var state = $(alertData).attr("data-state");
    var information = $(alertData).attr("data-information");

    var alertLatLngPoint = L.latLng(latitude,longitude);

    var alertOccouredArea = L.circle(alertLatLngPoint, 10, {
        color: '#FF9900',
        fillColor: '#FF00FF',
        fillOpacity: 0.5
    }).addTo(map);

    alertOccouredArea.bindPopup("Id: <b>"+id+"</b><br>"+
        "State: <b>"+state+"</b><br>"+
        "Information: <b>"+information+"</b><br>"
    ).openPopup();
    $(alertOccouredArea._popup._closeButton).on("click",function(){map.removeLayer(alertOccouredArea)});
    map.setView(alertLatLngPoint,18);

    /* TODO: for reference <Update lib or remove if not in use>: This `R`(RaphaelLayer: https://github.com/dynmeth/RaphaelLayer) library is dam buggy can't use it reliably */
    /*
     var alertPulse = new R.Pulse(
     alertLatLngPoint,
     8,
     {'stroke': '#FF9E0E', 'fill': '#FF0000'},
     {'stroke': '#FF3E2F', 'stroke-width': 3});
     map.addLayer(alertPulse);
     */


}

window.LocalStorageArray = LocalStorageArray;
window.focusOnSpatialObject = focusOnSpatialObject;
window.Alert = Alert;
window.showAlertInMap = showAlertInMap;
window.registerHandlers = handlers.registerHandlers;