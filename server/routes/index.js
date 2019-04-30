const uniPoolController = require('../controllers').UniPool;

module.exports = (app) => {
    app.get('/api/unipools', uniPoolController.getAll);
    app.get('/api/unipool/token/:tokenAddress', uniPoolController.byToken);
    app.get('/api/unipool/exchange/:exchangeAddress', uniPoolController.byExchangeAddress);
};