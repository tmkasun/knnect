/**
 * Created by tmkasun on 1/3/17.
 */

/*
 function SpatialObject(geoJSON) {
 this.id = geoJSON.id;

 // Have to store the coordinates , to use when user wants to draw path
 this.pathGeoJsons = []; // GeoJson standard MultiLineString(http://geojson.org/geojson-spec.html#id6) can't use here because this is a collection of paths(including property attributes)
 this.path = []; // Path is an array of sections, where each section is a notified state of the path
 //    {
 //        "type": "LineString",
 //        "coordinates": []
 //    };

 this.speedHistory = new LocalStorageArray(this.id);
 this.geoJson = L.geoJson(geoJSON, {
 pointToLayer: function (feature, latlng) {
 return L.marker(latlng, {icon: normalIcon, iconAngle: this.heading});
 }
 }); // Create Leaflet GeoJson object

 this.marker = this.geoJson.getLayers()[0];
 this.marker.options.title = this.id;

 this.popupTemplate = $('#markerPopup');
 this.marker.bindPopup(this.popupTemplate.html());
 return this;
 }

 SpatialObject.prototype.createLineStringFeature = function (state, information, coordinates) {
 return {
 "type": "Feature",
 "properties": {
 "state": state,
 "information": information
 },
 "geometry": {
 "type": "LineString",
 "coordinates": [coordinates]
 }
 };
 };

 SpatialObject.prototype.addTo = function (map) {
 this.geoJson.addTo(map);
 };

 SpatialObject.prototype.setSpeed = function (speed) {
 this.speed = speed;
 this.speedHistory.push(speed);
 //    console.log("DEBUG: this.speedHistory.length = "+this.speedHistory.length+" ApplicationOptions.constance.SPEED_HISTORY_COUNT = "+ApplicationOptions.constance.SPEED_HISTORY_COUNT);
 if (this.speedHistory.length > ApplicationOptions.constance.SPEED_HISTORY_COUNT) {
 this.speedHistory.splice(1, 1);
 }
 };

 SpatialObject.prototype.stateIcon = function () {
 // Performance of if-else, switch or map based conditioning http://stackoverflow.com/questions/8624939/performance-of-if-else-switch-or-map-based-conditioning
 switch (this.state) {
 case "NORMAL":
 return normalIcon;
 case "ALERTED":
 return alertedIcon;
 case "OFFLINE":
 return offlineIcon;
 case "WARNING":
 return warningIcon;
 default:
 return defaultIcon;
 }
 };

 SpatialObject.prototype.updatePath = function (LatLng) {
 this.path[this.path.length - 1].addLatLng(LatLng); // add LatLng to last section
 };

 SpatialObject.prototype.drawPath = function () {
 var previousSectionLastPoint = []; // re init all the time when calls the function
 if (this.path.length > 0) {
 this.removePath();
 //            throw "geoDashboard error: path already exist,remove current path before drawing a new path, if need to update LatLngs use setLatLngs method instead"; // Path already exist
 }
 for (var lineString in this.pathGeoJsons) {
 if (!this.pathGeoJsons.hasOwnProperty(lineString)) {
 continue
 }
 var currentSectionState = this.pathGeoJsons[lineString].properties.state;
 var currentSection = new L.polyline(this.pathGeoJsons[lineString].geometry.coordinates, this.getSectionStyles(currentSectionState)); // Create path object when and only drawing the path (save memory) TODO: if need directly draw line from geojson

 var currentSectionFirstPoint = this.pathGeoJsons[lineString].geometry.coordinates[0];
 console.log("DEBUG: previousSectionLastPoint = " + previousSectionLastPoint + " currentSectionFirstPoint = " + currentSectionFirstPoint);
 previousSectionLastPoint.push(currentSectionFirstPoint);
 var sectionJoin = new L.polyline(previousSectionLastPoint, this.getSectionStyles());
 sectionJoin.setStyle({className: "sectionJointStyle"});// Make doted line for section join , this class is currently defined in map.jag as a inner css

 previousSectionLastPoint = [this.pathGeoJsons[lineString].geometry.coordinates[this.pathGeoJsons[lineString].geometry.coordinates.length - 1]];
 sectionJoin.addTo(map);
 this.path.push(sectionJoin);
 console.log("DEBUG: Alert Information: " + this.pathGeoJsons[lineString].properties.information);
 currentSection.bindPopup("Alert Information: " + this.pathGeoJsons[lineString].properties.information);
 currentSection.addTo(map);
 this.path.push(currentSection);
 }
 };

 SpatialObject.prototype.removePath = function () {
 for (var section in this.path) {
 if (this.path.hasOwnProperty(section)) {
 map.removeLayer(this.path[section]);
 }
 }
 this.path = []; // Clear the path layer (save memory)
 };

 SpatialObject.prototype.getSectionStyles = function (state) {
 // TODO:<done> use option object to assign hardcode values
 var pathColor;
 switch (state) {
 case "NORMAL":
 pathColor = ApplicationOptions.colors.states.NORMAL; // Scope of function
 break;
 case "ALERTED":
 pathColor = ApplicationOptions.colors.states.ALERTED;
 break;
 case "WARNING":
 pathColor = ApplicationOptions.colors.states.WARNING;
 break;
 case "OFFLINE":
 pathColor = ApplicationOptions.colors.states.OFFLINE;
 break;
 default: // TODO: set path var
 return {color: ApplicationOptions.colors.states.UNKNOWN, weight: 8};
 }
 return {color: pathColor, weight: 8};
 };

 SpatialObject.prototype.update = function (geoJSON) {
 this.latitude = geoJSON.geometry.coordinates[1];
 this.longitude = geoJSON.geometry.coordinates[0];
 this.setSpeed(geoJSON.properties.speed);
 this.state = geoJSON.properties.state;
 this.heading = geoJSON.properties.heading;

 this.information = geoJSON.properties.information;

 if (geoJSON.properties.notify) {
 if (this.state != "NORMAL") {
 notifyAlert("Object ID: <span style='color: blue;cursor: pointer' onclick='focusOnSpatialObject(" + this.id + ")'>" + this.id + "</span> change state to: <span style='color: red'>" + geoJSON.properties.state + "</span> Info : " + geoJSON.properties.information);
 }
 var newLineStringGeoJson = this.createLineStringFeature(this.state, this.information, [this.latitude, this.longitude]);
 this.pathGeoJsons.push(newLineStringGeoJson);

 // only add the new path section to map if the spatial object is selected
 if (selectedSpatialObject == this.id) {
 var newPathSection = new L.polyline(newLineStringGeoJson.geometry.coordinates, this.getSectionStyles(geoJSON.properties.state));
 newPathSection.bindPopup("Alert Information: " + newLineStringGeoJson.properties.information);

 // Creating two sections joint // TODO : line color confusing , use diffrent color or seperator
 var lastSection = this.path[this.path.length - 1].getLatLngs();
 var joinLine = [lastSection[lastSection.length - 1], [this.latitude, this.longitude]];
 var sectionJoin = new L.polyline(joinLine, this.getSectionStyles());
 sectionJoin.setStyle({className: "sectionJointStyle"});// Make doted line for section join , this class is currently defined in map.jag as a inner css

 this.path.push(sectionJoin);
 this.path.push(newPathSection); // Order of the push matters , last polyLine object should be the `newPathSection` not the `sectionJoin`

 sectionJoin.addTo(map);
 newPathSection.addTo(map);
 }
 }

 // Update the spatial object leaflet marker
 this.marker.setLatLng([this.latitude, this.longitude]);
 this.marker.setIconAngle(this.heading);
 this.marker.setIcon(this.stateIcon());

 if (this.pathGeoJsons.length > 0) {
 // To prevent conflicts in
 // Leaflet(http://leafletjs.com/reference.html#latlng) and geoJson standards(http://geojson.org/geojson-spec.html#id2),
 // have to do this swapping, but the resulting geoJson in not upto geoJson standards
 // TODO: write func to swap coordinates
 this.pathGeoJsons[this.pathGeoJsons.length - 1].geometry.coordinates.push([geoJSON.geometry.coordinates[1], geoJSON.geometry.coordinates[0]]);
 } else {
 newLineStringGeoJson = this.createLineStringFeature(this.state, this.information, [geoJSON.geometry.coordinates[1], geoJSON.geometry.coordinates[0]]);
 this.pathGeoJsons.push(newLineStringGeoJson);
 }

 if (selectedSpatialObject == this.id) {
 this.updatePath([geoJSON.geometry.coordinates[1], geoJSON.geometry.coordinates[0]]);
 chart.load({columns: [this.speedHistory.getArray()]});
 map.setView([this.latitude, this.longitude]);
 }

 // TODO: remove consecutive two lines object ID never change with time + information toggled only when `geoJSON.properties.notify` true (done in CEP side)
 // TODO: use general popup DOM
 this.popupTemplate.find('#objectId').html(this.id);
 this.popupTemplate.find('#information').html(this.information);

 this.popupTemplate.find('#speed').html(this.speed);
 this.popupTemplate.find('#heading').html(this.heading);
 this.marker.setPopupContent(this.popupTemplate.html())


 };
 */
'use strict';
class SpatialObject {
    constructor(geoJSON) {
        this.icons = {
            normalIcon: L.icon({
                iconUrl: ApplicationOptions.leaflet.iconUrls.normalIcon,
                shadowUrl: false,
                iconSize: [24, 24],
                iconAnchor: [+12, +12],
                popupAnchor: [-2, -5]
            }),
            alertedIcon: L.icon({
                iconUrl: ApplicationOptions.leaflet.iconUrls.alertedIcon,
                shadowUrl: false,
                iconSize: [24, 24],
                iconAnchor: [+12, +12],
                popupAnchor: [-2, -5]
            }),
            offlineIcon: L.icon({
                iconUrl: ApplicationOptions.leaflet.iconUrls.offlineIcon,
                iconSize: [24, 24],
                iconAnchor: [+12, +12],
                popupAnchor: [-2, -5]
            }),
            warningIcon: L.icon({
                iconUrl: ApplicationOptions.leaflet.iconUrls.warningIcon,
                iconSize: [24, 24],
                iconAnchor: [+12, +12],
                popupAnchor: [-2, -5]
            }),
            defaultIcon: L.icon({
                iconUrl: ApplicationOptions.leaflet.iconUrls.defaultIcon,
                iconSize: [36, 36],
                iconAnchor: [+12, +12],
                popupAnchor: [-2, -5]
            })
        };

        this.id = geoJSON.id;
        // Have to store the coordinates , to use when user wants to draw path
        this.pathGeoJsons = []; // GeoJson standard MultiLineString(http://geojson.org/geojson-spec.html#id6) can't use here because this is a collection of paths(including property attributes)
        this.path = []; // Path is an array of sections, where each section is a notified state of the path
//    {
//        "type": "LineString",
//        "coordinates": []
//    };
        this.speedHistory = new LocalStorageArray(this.id);
        this.geoJson = L.geoJson(geoJSON, {
            pointToLayer: (feature, latlng) => {
                return L.marker(latlng, {icon: this.icons.normalIcon, iconAngle: this.heading});
            }
        })
        ; // Create Leaflet GeoJson object

        this.marker = this.geoJson.getLayers()[0];
        this.marker.options.title = this.id;

        this.popupTemplate = $('#markerPopup');
        this.marker.bindPopup(this.popupTemplate.html());

    }

    /**
     * Update the internal values with new location data and update the map location as well
     * @param geoJSON {Object} New location data in GeoJSON format
     */
    update(geoJSON) {
        this.latitude = geoJSON.geometry.coordinates[1];
        this.longitude = geoJSON.geometry.coordinates[0];
        this.state = geoJSON.properties.state;
        this.heading = geoJSON.properties.heading;
        this.information = geoJSON.properties.information;

        this._setSpeed(geoJSON.properties.speed);
        if (geoJSON.properties.notify) {
            if (this.state != "NORMAL") {
                notifyAlert("Object ID: <span style='color: blue;cursor: pointer' onclick='focusOnSpatialObject(" + this.id + ")'>" + this.id + "</span> change state to: <span style='color: red'>" + geoJSON.properties.state + "</span> Info : " + geoJSON.properties.information);
            }
            var newLineStringGeoJson = this._createLineStringFeature(this.state, this.information, [this.latitude, this.longitude]);
            this.pathGeoJsons.push(newLineStringGeoJson);

            // only add the new path section to map if the spatial object is selected
            if (selectedSpatialObject == this.id) {
                var newPathSection = new L.polyline(newLineStringGeoJson.geometry.coordinates, this.getIconForState(geoJSON.properties.state));
                newPathSection.bindPopup("Alert Information: " + newLineStringGeoJson.properties.information);

                // Creating two sections joint // TODO : line color confusing , use diffrent color or seperator
                var lastSection = this.path[this.path.length - 1].getLatLngs();
                var joinLine = [lastSection[lastSection.length - 1], [this.latitude, this.longitude]];
                var sectionJoin = new L.polyline(joinLine, this.getIconForState());
                sectionJoin.setStyle({className: "sectionJointStyle"});// Make doted line for section join , this class is currently defined in map.jag as a inner css

                this.path.push(sectionJoin);
                this.path.push(newPathSection); // Order of the push matters , last polyLine object should be the `newPathSection` not the `sectionJoin`

                sectionJoin.addTo(map);
                newPathSection.addTo(map);
            }
        }
        // Update the spatial object leaflet marker
        this.marker.setLatLng([this.latitude, this.longitude]);
        this.marker.setIconAngle(this.heading);
        this.marker.setIcon(this.getIconForState(this.state));
        if (this.pathGeoJsons.length > 0) {
            // To prevent conflicts in
            // Leaflet(http://leafletjs.com/reference.html#latlng) and geoJson standards(http://geojson.org/geojson-spec.html#id2),
            // have to do this swapping, but the resulting geoJson in not upto geoJson standards
            // TODO: write func to swap coordinates
            this.pathGeoJsons[this.pathGeoJsons.length - 1].geometry.coordinates.push([geoJSON.geometry.coordinates[1], geoJSON.geometry.coordinates[0]]);
        } else {
            newLineStringGeoJson = this._createLineStringFeature(this.state, this.information, [geoJSON.geometry.coordinates[1], geoJSON.geometry.coordinates[0]]);
            this.pathGeoJsons.push(newLineStringGeoJson);
        }

        if (selectedSpatialObject == this.id) {
            this.updatePath([geoJSON.geometry.coordinates[1], geoJSON.geometry.coordinates[0]]);
            chart.load({columns: [this.speedHistory.getArray()]});
            map.setView([this.latitude, this.longitude]);
        }

        this.popupTemplate.find('#objectId').html(this.id);
        this.popupTemplate.find('#information').html(this.information);

        // TODO: remove consecutive two lines object ID never change with time + information toggled only when `geoJSON.properties.notify` true (done in CEP side)
        // TODO: use general popup DOM
        this.popupTemplate.find('#speed').html(this.speed);
        this.popupTemplate.find('#heading').html(this.heading);
        this.marker.setPopupContent(this.popupTemplate.html())

    }

    getIconForState(state) {
        // Performance of if-else, switch or map based conditioning http://stackoverflow.com/questions/8624939/performance-of-if-else-switch-or-map-based-conditioning
        if (!state) {
            state = this.state;
        }
        switch (state) {
            case "NORMAL":
                return this.icons.normalIcon;
            case "ALERTED":
                return this.icons.alertedIcon;
            case "OFFLINE":
                return this.icons.offlineIcon;
            case "WARNING":
                return this.icons.warningIcon;
            default:
                return this.icons.defaultIcon;
        }
    }

    updatePath(LatLng) {
        this.path[this.path.length - 1].addLatLng(LatLng); // add LatLng to last section
    }

    /**
     * A private method to set the speed value to instance and update the speed history array for UI
     * @param speed
     * @private
     */
    _setSpeed(speed) {
        this.speed = speed;
        this.speedHistory.push(speed);
//    console.log("DEBUG: this.speedHistory.length = "+this.speedHistory.length+" ApplicationOptions.constance.SPEED_HISTORY_COUNT = "+ApplicationOptions.constance.SPEED_HISTORY_COUNT);
        if (this.speedHistory.length > ApplicationOptions.constance.SPEED_HISTORY_COUNT) {
            this.speedHistory.splice(1, 1);
        }

    }

    _createLineStringFeature(state, information, coordinates) {
        return {
            "type": "Feature",
            "properties": {
                "state": state,
                "information": information
            },
            "geometry": {
                "type": "LineString",
                "coordinates": [coordinates]
            }
        };
    }

    drawPath() {
        var previousSectionLastPoint = []; // re init all the time when calls the function
        if (this.path.length > 0) {
            this.removePath();
            //            throw "geoDashboard error: path already exist,remove current path before drawing a new path, if need to update LatLngs use setLatLngs method instead"; // Path already exist
        }
        for (var lineString in this.pathGeoJsons) {
            if (!this.pathGeoJsons.hasOwnProperty(lineString)) {
                continue
            }
            var currentSectionState = this.pathGeoJsons[lineString].properties.state;
            var currentSection = new L.polyline(this.pathGeoJsons[lineString].geometry.coordinates, this.getIconForState(currentSectionState)); // Create path object when and only drawing the path (save memory) TODO: if need directly draw line from geojson

            var currentSectionFirstPoint = this.pathGeoJsons[lineString].geometry.coordinates[0];
            console.log("DEBUG: previousSectionLastPoint = " + previousSectionLastPoint + " currentSectionFirstPoint = " + currentSectionFirstPoint);
            previousSectionLastPoint.push(currentSectionFirstPoint);
            var sectionJoin = new L.polyline(previousSectionLastPoint, this.getIconForState());
            sectionJoin.setStyle({className: "sectionJointStyle"});// Make doted line for section join , this class is currently defined in map.jag as a inner css

            previousSectionLastPoint = [this.pathGeoJsons[lineString].geometry.coordinates[this.pathGeoJsons[lineString].geometry.coordinates.length - 1]];
            sectionJoin.addTo(map);
            this.path.push(sectionJoin);
            console.log("DEBUG: Alert Information: " + this.pathGeoJsons[lineString].properties.information);
            currentSection.bindPopup("Alert Information: " + this.pathGeoJsons[lineString].properties.information);
            currentSection.addTo(map);
            this.path.push(currentSection);
        }
    }

    removePath() {
        for (var section in this.path) {
            if (this.path.hasOwnProperty(section)) {
                map.removeLayer(this.path[section]);
            }
        }
        this.path = []; // Clear the path layer (save memory)
    };

}