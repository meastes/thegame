import express from 'express';
import fs from 'fs';

import ItemActivator from '../node/src/item-activator';

const app = express();
const itemActivator = new ItemActivator();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.options('*', (req, res) => { res.sendStatus(200); });
app.get('/items', (req, res) => {
    fs.readFile('./data/items', (err, data) => {
        if (err) {
            console.err(err);  // eslint-disable-line no-console
        }
        res.send(data);
    });
});
app.post('/item/:id', (req, res) => {
    itemActivator.useItem(req.params.id)
        .then(result =>
            res.send(JSON.stringify({
                success: true,
                result,
            }))
        )
        .catch(error => res.status(500).send(JSON.stringify({
            success: false,
            error,
        })));
});
app.post('/item/:id/:target', (req, res) => {
    itemActivator.useItem(req.params.id, req.params.target)
        .then(result =>
            res.send(JSON.stringify({
                success: true,
                result,
            }))
        )
        .catch(error => res.status(500).send(JSON.stringify({
            success: false,
            error,
        })));
});

app.listen(8081);
