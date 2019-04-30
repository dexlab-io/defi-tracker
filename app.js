const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const http = require('http');

/**
 * Poly for fetch
 */
global.fetch = require("node-fetch");

import EthereumHDWallet from './lib/ethereum/EthereumHDWallet';



// Set up the express app
const app = express();
app.use(logger('dev'));

// (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Adding routes
require('./server/routes')(app);

app.get('/test', async (req, res) => {
    // console.log('EthereumHDWallet', EthereumHDWallet)
    const t = new EthereumHDWallet(null, '0x5e90bDc06E1aF172ce97fA8a029D0587eCE6a831');
    await t.Maker.getState();

    console.log('this.CDPs', t.Maker.CDPs);
    
    res.status(200).send(t.Maker.CDPs)
});

// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get('*', (req, res) => res.status(200).send({
    message: 'Suca',
}));



const port = parseInt(process.env.PORT, 10) || 8000;
app.set('port', port);

const server = http.createServer(app);
server.listen(port);

module.exports = app;