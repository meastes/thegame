import fs from 'fs';
import Log from 'log';
import PouchDb from 'pouchdb';

export default class ItemStore {
    constructor() {
        this.log = new Log('debug', fs.createWriteStream('./logs/item-store.log', { flags: 'a' }));
        this.itemDb = new PouchDb('items');
        this.itemDb.allDocs().then(docs => this.log.debug(`Item count: ${docs.rows.length}`));
    }

    getItems() {
        return this.itemDb.allDocs({ include_docs: true })
            .then(data => data.rows.map(doc => doc.doc.item));
    }

    addItem(item) {
        const itemDoc = { _id: item.Id, item, created: Date.now() };
        this.log.debug(`Adding item: ${JSON.stringify(itemDoc)}`);
        this.itemDb.put(itemDoc);
        this.itemDb.allDocs().then(docs => this.log.debug(`New item count: ${docs.rows.length}`));
    }

    removeItem(Id) {
        this.log.debug(`Removing item: ${Id}`);
        this.itemDb.get(Id).then(item => this.itemDb.remove(item));
    }
}
