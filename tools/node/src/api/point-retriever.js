import fs from 'fs';
import Log from 'log';
import request from 'request-promise';
import apiConfig from '../../../../config/api.config';

const URL_POINTS = 'http://thegame.nerderylabs.com/points';

export default class PointRetriever {
    constructor(itemStore) {
        this.log =
            new Log('debug', fs.createWriteStream('./logs/point-retriever.log', { flags: 'a' }));
        this.itemStore = itemStore;
    }

    requestPoints() {
        request.post({
            url: URL_POINTS,
            headers: {
                apikey: apiConfig.apikey,
            },
            timeout: 60000,
        })
        .then(res => {
            const json = JSON.parse(res);
            if (json.Item) {
                this.log.debug(`Got an item; adding it to the store: ${json.Item}`);
                this.itemStore.addItem(json.Item.Fields[0]);
            }
            this.log.debug(json);
            setTimeout(() => this.requestPoints(), 1000);
        })
        .catch(err => {
            this.log.error(err);
            setTimeout(() => this.requestPoints(), 1000);
        });
    }
}
