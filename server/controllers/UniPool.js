const UniPool = require('../../models').UniPool;

module.exports = {
    getAll: async (req, res) => {
        const data = await UniPool.findAll();
        res.send(data);
    }
}