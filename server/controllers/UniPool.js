const UniPool = require('../../models').UniPool;
import EthereumHDWallet from '../../lib/ethereum/EthereumHDWallet';

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

    updateStats: async (req, res) => {
        console.log('req', req.params);
        const data = await UniPool.findOne({
            where: {
                exchangeAddress: req.params.exchangeAddress
            }
        }) || {};

        console.log('data', data)

        const t = new EthereumHDWallet(null, '0x5e90bDc06E1aF172ce97fA8a029D0587eCE6a831');
        const stats = await t.Uniswap.getMarketData(data, t.lastBlockCheck);

        //console.log('stats', stats)
        data.ethPoolTotal = stats.curEthPoolTotal;
        data.tokenPoolTotal = stats.curTokenPoolTotal;
        data.totalSell = stats.totalSell;
        data.totalBuy = stats.totalBuy;
        data.totalVolume = stats.totalVolume;
        data.lastBlockCheck = stats.latestBlock;

        await data.save().catch(error => {
            console.log('error')
          });
        res.send(data);
    },
}