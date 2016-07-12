import fs from 'fs';
import Log from 'log';
import request from 'request-promise';

const URL_POINTS = 'http://thegame.nerderylabs.com:1337/points/meastes';

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
                Name: json.PlayerName,
                ActiveEffects: json.Effects,
                Points: json.Points,
            };
        })
        .catch(err => {
            this.log.error(err);
        });
    }
}
