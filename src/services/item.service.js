import Vue from 'vue';

const BASE_URL = `http://${window.location.hostname}:8081`;

export default class ItemService {
    constructor() {
        this._http = Vue.http;
    }
    getItems() {
        return this._http.get(`${BASE_URL}/items/list`).then(res => res.data);
    }
    useItem(id, target) {
        let url = `${BASE_URL}/items/use/${id}`;
        if (target) {
            url += `/${target}`;
        }
        return this._http.post(url).then(res => res.data);
    }
}
