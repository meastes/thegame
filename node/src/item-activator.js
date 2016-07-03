/* eslint no-new: "off" */
import fs from 'fs';
import Log from 'log';
import request from 'request-promise';
import apiConfig from '../../config/api.config';
import ItemStore from './item.store';

const URL_ITEMS = 'http://thegame.nerderylabs.com/items/use/';

export default class ItemActivator {
    constructor() {
        this.log =
            new Log('debug', fs.createWriteStream('./logs/item-activator.log', { flags: 'a' }));
        this.itemStore = new ItemStore();
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
            this.itemStore.removeItem(itemId);
            return Promise.reject(err);
        });
    }
}
