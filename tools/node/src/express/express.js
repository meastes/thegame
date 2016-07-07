import express from 'express';

import ItemStore from '../api/item.store';
import PlayerInfo from '../api/player-info';
import ItemActivator from '../api/item-activator';
import PointRetriever from '../api/point-retriever';

const app = express();
const itemStore = new ItemStore();
const playerInfo = new PlayerInfo();
const itemActivator = new ItemActivator(itemStore);
const pr = new PointRetriever(itemStore);
pr.requestPoints();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.options('*', (req, res) => { res.sendStatus(200); });
app.get('/player', (req, res) => {
    playerInfo.getPlayerInfo().then(json => res.send(json));
});
app.get('/items', (req, res) => {
    itemStore.getItems().then(json => res.send(json));
});
app.post('/items/use/:id', (req, res) => {
    itemActivator.useItem(req.params.id)
        .then(result => {
            const json = JSON.parse(result);
            res.send(JSON.stringify({
                success: true,
                result: json,
            }));
        })
        .catch(error => res.status(500).send(JSON.stringify({
            success: false,
            error,
        })));
});
app.post('/items/use/:id/:target', (req, res) => {
    itemActivator.useItem(req.params.id, req.params.target)
        .then(result => {
            const json = JSON.parse(result);
            res.send(JSON.stringify({
                success: true,
                result: json,
            }));
        })
        .catch(error => res.status(500).send(JSON.stringify({
            success: false,
            error,
        })));
});

app.listen(8081);
