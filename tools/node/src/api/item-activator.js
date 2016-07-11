/* eslint no-new: "off" */
import fs from 'fs';
import Log from 'log';
import request from 'request-promise';
import apiConfig from '../../../../config/api.config';

const URL_ITEMS = 'http://thegame.nerderylabs.com:1337/items/use/';

export default class ItemActivator {
    constructor(itemStore) {
        this.log =
            new Log('debug', fs.createWriteStream('./logs/item-activator.log', { flags: 'a' }));
        this.itemStore = itemStore;
    }

    useItem(itemId, target) {
        let url = `${URL_ITEMS}${itemId}`;
        if (target) {
            url += `?target=${target}`;
        }
        this.log.debug(`Using item with ID [${itemId}] on target [${target}]`);
        return request.post({
            url,
            headers: {
                apikey: apiConfig.apikey,
            },
        })
        .then(res => {
            this.log.debug(res);
            this.itemStore.removeItem(itemId);
            const json = JSON.parse(res);
            if (json.Messages) {
                for (const message of json.Messages) {
                    this.log.debug(`Parsing message: ${message}`);
                    if (message.includes('treasure')) {
                        this.log.debug(`Found bonus item: ${message}`);
                        this._addBonusItem(message);
                    }
                }
            }
            return res;
        })
        .catch(err => {
            this.log.error(err);
            if (err.statusCode === 400) {
                this.itemStore.removeItem(itemId);
            }
            return Promise.reject(err);
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
