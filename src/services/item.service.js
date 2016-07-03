import Vue from 'vue';

export default class ItemService {
    constructor() {
        this._http = Vue.http;
    }
    getItems() {
        return this._http.get('http://localhost:8081/items').then(res => res.data);
    }
}
