import Vue from 'vue';

const BASE_URL = `http://${window.location.hostname}:8081`;

export default class ItemService {
    constructor() {
        this._http = Vue.http;
    }
    getItems() {
        // For the time being filter out any items that have a created timestamp
        // Later we will ensure items are only 48 hours old.
        return this._http.get(`${BASE_URL}/items`)
            .then(res => res.data.filter(item => !item.Created));
    }
    useItem(id, target) {
        let url = `${BASE_URL}/items/use/${id}`;
        if (target) {
            url += `/${target}`;
        }
        return this._http.post(url).then(res => res.data);
    }
}
