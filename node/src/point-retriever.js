/* eslint no-new: "off" */
import fs from 'fs';
import Log from 'log';
import store from 'node-persist';
import request from 'request';
import apiConfig from '../../config/api.config';

const PATH_STORE = '../../../../data';
const URL_POINTS = 'http://thegame.nerderylabs.com/points';

class PointRetriever {
    constructor() {
        this.log = new Log('debug', fs.createWriteStream('point-retriever.log', { flags: 'a' }));
        this.store = store;
        this.init();
    }

    init() {
        this.store.initSync({ dir: PATH_STORE });
    }

    getPoints() {
        setInterval(() => this.requestPoints(), 1200);
    }

    requestPoints() {
        request.post({
            url: URL_POINTS,
            headers: {
                apikey: apiConfig.apikey,
            },
        }, (err, res, body) => {
            if (err) {
                this.log.error(err);
            } else {
                const json = JSON.parse(body);
                if (json.Item) {
                    this.log.debug(`Got an item; adding it to the store: ${json.Item}`);
                    this.addItem(json.Item);
                }
                this.log.debug(json);
            }
            setTimeout(() => this.requestPoints(), 1000);
        });
    }

    get items() {
        return this.store.getItem('items') || [];
    }
    addItem(item) {
        const curItems = this.items;
        curItems.push(item);
        this.log.debug(`Updating items with: ${curItems}`);
        this.store.setItem('items', curItems);
    }
}

const pr = new PointRetriever();
pr.requestPoints();
