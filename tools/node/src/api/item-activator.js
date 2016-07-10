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
        return request.post({
            url,
            headers: {
                apikey: apiConfig.apikey,
            },
        })
        .then(res => {
            this.log.debug(res);
            this.itemStore.removeItem(itemId);
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
}
