import fs from 'fs';
import Log from 'log';
import request from 'request-promise';
import apiConfig from '../../../../config/api.config';

const URL_POINTS = 'http://thegame.nerderylabs.com:1337/points';
const MAX_CONSECUTIVE_ERRORS = 5;

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
            if (json.Messages) {
                for (const message of json.Messages) {
                    this.log.debug(`Parsing message: ${message}`);
                    if (message.includes('angered the gods')) {
                        throw new Error(json);
                    } else if (message.includes('treasure')) {
                        this.log.debug(`Found bonus item: ${message}`);
                        this._addBonusItem(message);
                    }
                }
            }
            this.errorCount = 0;
            if (json.Item) {
                this.log.debug(`Got an item; adding it to the store: ${json.Item}`);
                this.itemStore.addItem(json.Item.Fields[0]);
            }
            setTimeout(() => this.requestPoints(), 990);
        })
        .catch(err => {
            this.log.error(err);
            this.errorCount++;
            if (this.errorCount >= MAX_CONSECUTIVE_ERRORS) {
                this.log.debug(
                    `Encountered ${this.errorCount} consecutive errors. Sleeping for 30 minutes.`);
                setTimeout(() => this.requestPoints(), 60 * 30 * 1000);
            } else {
                setTimeout(() => this.requestPoints(), 990);
            }
        });
    }

    _addBonusItem(message) {
        const msgParts = message.split('|');
        const id = msgParts[0].substring(
            msgParts[0].indexOf('<') + 1,
            msgParts[0].indexOf('>'));
        const name = msgParts[1].substring(
            msgParts[1].indexOf('<') + 1,
            msgParts[1].indexOf('>'));
        this.itemStore.getItemByName(name).then(items => {
            const goodItem = items[0];
            goodItem.Id = id;
            delete goodItem.Created;
            this.itemStore.addItem(goodItem);
        });
    }
}
