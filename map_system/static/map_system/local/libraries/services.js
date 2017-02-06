'use strict';
/**
 * Created by tmkasun on 1/14/17.
 */

var request = require('superagent');
// var utils = require('./utils');

/**
 * This is an abstract parent class for all types of map services, This initialize the axios connection with base URI for
 * knnect APIs
 */
class MapService {
    /**
     * Create single instance of axios client to make connections with back end apis
     */
    constructor() {
        this.service_endpoint = "/apis/";
        this.baseURL = 'http://localhost:8000/apis';
        this.client = request;
        // this.client.domain = this.baseURL;
    }
}

/**
 * LK Stands for Last Known and LKState retrive the Last Know states of an object or get current states of all available
 * spatial objects
 */
class LKStates extends MapService {
    /**
     * Get all the spatial objects last know state from the persistent storage
     * @param callback {function} A function to call in the success call to the api
     * @returns {Promise} Always return an promise object which may chained the a callback method if given when invoking
     */
    getAll(callback = false) {
        var response = this.client.get(this.baseURL + '/lk_states');
        if (callback) {
            return response.then(callback);
        } else {
            return response;
        }
    }
}

/**
 * This class handle and wrap all the backend service calls related to Spatial Object Activities
 */
class SpatialActivityService extends MapService {
    /**
     *
     * @param object_id {String} Id of an object i:e: IMEI , Registration number or UUID
     * @param limit {Number} Number of records needs to be fetched.
     */
    getHistory(object_id, limit) {
        var response = this.client.get(this.baseURL + '/session_path/' + object_id).query({limit: limit});
        return response;
    }
}

window.LKStates = LKStates;
window.SpatialActivityService = SpatialActivityService;
module.exports.LKStates = LKStates;
module.exports.SpatialActivityService = SpatialActivityService;