const uniPoolController = require('../controllers').UniPool;

module.exports = (app) => {
    app.get('/api/unipools', uniPoolController.getAll);
};