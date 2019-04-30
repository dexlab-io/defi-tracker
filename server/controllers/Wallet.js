import EthereumHDWallet from '../../lib/ethereum/EthereumHDWallet';

module.exports = {
    get: async (req, res) => {
        const w = new EthereumHDWallet(null, req.params.wallet);
        const wallet = await w.export();
        res.status(200).send(wallet)
    },
    getTxs: async (req, res) => {
        const w = new EthereumHDWallet(null, req.params.wallet);
        await w.fetchTransactions();
        res.status(200).send(w.transactions)
    },
    getCollectibles: async (req, res) => {
        const w = new EthereumHDWallet(null, req.params.wallet);
        await w.fetchCollectibles();
        res.status(200).send(w.collectibles)
    },
    getTokens: async (req, res) => {
        const w = new EthereumHDWallet(null, req.params.wallet);
        await w.loadTokensList();
        res.status(200).send(w.tokens)
    },
    getCDPs: async (req, res) => {
        const w = new EthereumHDWallet(null, req.params.wallet);
        await w.Maker.getState();
        res.status(200).send(w.Maker.CDPs)
    },
}