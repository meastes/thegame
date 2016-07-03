/* eslint no-new: "off" */
import fs from 'fs';
import Log from 'log';
import store from 'node-persist';

const PATH_STORE = '../../../../data';

export default class ItemStore {
    constructor() {
        this.log = new Log('debug', fs.createWriteStream('./logs/use-item.log', { flags: 'a' }));
        this.store = store;
        this.init();
    }

    init() {
        this.store.initSync({ dir: PATH_STORE });
    }

    get items() {
        return this.store.getItem('items') || [];
    }
    addItem(item) {
        const curItems = this.items;
        curItems.push(item);
        this.store.setItem('items', curItems);
    }
    removeItem(id) {
        const newItems = this.items.filter(item => item.Fields[0].Id !== id);
        this.store.setItem('items', newItems);
    }
}
