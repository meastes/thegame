import Vue from 'vue';

const BASE_URL = `http://${window.location.hostname}:8081`;

export default class PlayerService {
    constructor() {
        this._http = Vue.http;
    }
    getPlayerInfo() {
        return this._http.get(`${BASE_URL}/player/info`).then(res => res.data);
    }
}
