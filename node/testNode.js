const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const { config } = require('process');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get('/status', (req, res) => {
    res.send('API is up and running! GET');
});

app.get('/config/:apikey', (req, res) => {
    const config = {
        'time': Date.now(),
        'interval': 60
    };
    res.send(config);
});

app.post('/data', (req, res) => {
    console.log(req.body);
    res.send('API is up and running! POST');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
    console.log(`API listening at http://localhost:${port}`);
});