/**
 * Created by tmkasun on 1/14/17.
 */

class MapService {
    constructor() {
        this.service_endpoint = "/apis/";
        this.client = axios.create( //https://github.com/mzabriskie/axios
            {
                baseURL: 'http://localhost:8000' + this.service_endpoint
            }
        );
    }
}

class LKStates extends MapService {
    getAll(callback = false) {
        var response = this.client.get('lk_states');
        if(callback) {
            return response.then(callback);
        } else {
            return response;
        }
    }
}