const UniPool = require('../../models').UniPool;

module.exports = {
    getAll: async (req, res) => {
        const data = await UniPool.findAll();
        res.send(data);
    },
    byToken: async (req, res) => {
        console.log('req', req.params);
        const data = await UniPool.findOne({
            where: {
                erc20Address: req.params.tokenAddress
            }
        });
        res.send(data);
    },
    byExchangeAddress: async (req, res) => {
        console.log('req', req.params);
        const data = await UniPool.findOne({
            where: {
                exchangeAddress: req.params.exchangeAddress
            }
        }) || {};
        res.send(data);
    },
}