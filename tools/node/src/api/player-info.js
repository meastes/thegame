import fs from 'fs';
import Log from 'log';
import request from 'request-promise';

const URL_POINTS = 'http://thegame.nerderylabs.com:1337/points';

export default class PlayerInfo {
    constructor() {
        this.log = new Log('debug', fs.createWriteStream('./logs/player-info.log', { flags: 'a' }));
    }

    getPlayerInfo() {
        return request.get({
            url: URL_POINTS,
            timeout: 10000,
        })
        .then(res => {
            const json = JSON.parse(res);
            this.log.debug(json);
            return {
                Name: json.Fields[0].PlayerName,
                ActiveEffects: json.Fields[0].Effects,
                Points: json.Fields[0].Points,
            };
        })
        .catch(err => {
            this.log.error(err);
        });
    }
}
