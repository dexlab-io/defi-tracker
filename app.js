const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const http = require('http');

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
    const t = new EthereumHDWallet();
    res.status(200).send({
        message: await t.web3.eth.getBlock('latest'),
    })
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