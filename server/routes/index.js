import {UniPool, Wallet} from '../controllers';

module.exports = (app) => {
    app.get('/api/unipools', UniPool.getAll);
    app.get('/api/unipool/token/:tokenAddress', UniPool.byToken);
    app.get('/api/unipool/exchange/:exchangeAddress', UniPool.byExchangeAddress);


    /**
     * Wallet API
     */
    app.get('/api/wallet/:wallet', Wallet.get);
    app.get('/api/wallet/:wallet/transactions', Wallet.getTxs);
    app.get('/api/wallet/:wallet/collectibles', Wallet.getCollectibles);
    app.get('/api/wallet/:wallet/tokens', Wallet.getTokens);
    app.get('/api/wallet/:wallet/cdps', Wallet.getCDPs);
};