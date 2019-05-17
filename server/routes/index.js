import {UniPool, Wallet} from '../controllers';
import urlExists from 'url-exists';

module.exports = (app) => {
    app.get('/api/unipools', UniPool.getAll);
    app.get('/api/unipool/token/:tokenAddress', UniPool.byToken);
    app.get('/api/unipool/exchange/:exchangeAddress', UniPool.byExchangeAddress);
    app.get('/api/unipool/exchange/:exchangeAddress/update', UniPool.updateStats);


    app.get('/image/token/:address', async (req, res) => {
        const url = `https://raw.githubusercontent.com/Alexintosh/tokens/master/images/${req.params.address}.png`;
        urlExists(url, (err, exists) =>{
            console.log(exists); // true
            if( exists ){
                res.redirect(url);
            } else {
                res.redirect('/img/wallet.svg');
            }
        });
    });
    

    /**
     * Wallet API
     */
    app.get('/api/wallet/:wallet', Wallet.get);
    app.get('/api/ens/:wallet', Wallet.ens);
    app.get('/wallet/:wallet', Wallet.walletView);

    app.get('/api/wallet/:wallet/transactions', Wallet.getTxs);
    app.get('/api/wallet/:wallet/collectibles', Wallet.getCollectibles);
    app.get('/api/wallet/:wallet/tokens', Wallet.getTokens);
    app.get('/api/wallet/:wallet/cdps', Wallet.getCDPs);
};