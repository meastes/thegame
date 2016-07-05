import fs from 'fs';
import Log from 'log';
import request from 'request-promise';
import apiConfig from '../../../../config/api.config';

const URL_POINTS = 'http://thegame.nerderylabs.com/points';

export default class PlayerInfo {
    constructor() {
        this.log = new Log('debug', fs.createWriteStream('./logs/player-info.log', { flags: 'a' }));
    }

    getPlayerInfo() {
        return request.get({
            url: URL_POINTS,
            headers: {
                apikey: apiConfig.apikey,
            },
            timeout: 10000,
        })
        .then(res => {
            const json = JSON.parse(res);
            this.log.debug(json);
            return {
                Name: json.Fields[0].Name,
                ActiveEffects: json.Fields[0].ActiveEffects,
                Points: json.Fields[0].Points,
            };
        })
        .catch(err => {
            this.log.error(err);
        });
    }
}
