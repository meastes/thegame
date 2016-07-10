import fs from 'fs';
import Log from 'log';
import request from 'request-promise';
import apiConfig from '../../../../config/api.config';

const URL_POINTS = 'http://thegame.nerderylabs.com:1337/points';

export default class PointRetriever {
    constructor(itemStore) {
        this.log =
            new Log('debug', fs.createWriteStream('./logs/point-retriever.log', { flags: 'a' }));
        this.itemStore = itemStore;
        this.errorCount = 0;
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
            this.log.debug(json);
            this.errorCount = 0;
            if (json.Item) {
                this.log.debug(`Got an item; adding it to the store: ${json.Item}`);
                this.itemStore.addItem(json.Item.Fields[0]);
            }
            setTimeout(() => this.requestPoints(), 1050);
        })
        .catch(err => {
            this.log.error(err);
            this.errorCount++;
            if (this.errorCount > 10) {
                this.log.debug(
                    `Encountered ${this.errorCount} consecutive errors. Sleeping for 30 minutes.`);
                setTimeout(() => this.requestPoints(), 60 * 30 * 1000);
            } else {
                setTimeout(() => this.requestPoints(), 1050);
            }
        });
    }
}
