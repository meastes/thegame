import Vue from 'vue';

const BASE_URL = `http://${window.location.hostname}:8081`;

export default class ItemService {
    constructor() {
        this._http = Vue.http;
    }
    getItems() {
        return this._http.get(`${BASE_URL}/items`)
            .then(res => res.data.sort((a, b) => {
                const createdA = a.Created || 0;
                const createdB = b.Created || 0;
                return createdA - createdB;
            }));
    }
    useItem(id, target) {
        let url = `${BASE_URL}/items/use/${id}`;
        if (target) {
            url += `/${target}`;
        }
        return this._http.post(url).then(res => res.data);
    }
}
