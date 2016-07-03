import Vue from 'vue';

const BASE_URL = 'http://localhost:8081';

export default class ItemService {
    constructor() {
        this._http = Vue.http;
    }
    getItems() {
        return this._http.get(`${BASE_URL}/items`).then(res => JSON.parse(res.data));
    }
    useItem(id, target) {
        let url = `${BASE_URL}/item/${id}`;
        if (target) {
            url += `/${target}`;
        }
        return this._http.post(url).then(res => JSON.parse(res.data));
    }
}
