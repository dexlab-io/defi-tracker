'use strict';

module.exports = {
  up: (queryInterface, DataTypes) => {

    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
          queryInterface.addColumn('UniPools', 'totalVolume', {
              type: DataTypes.FLOAT
          }, { transaction: t }),
          queryInterface.addColumn('UniPools', 'ethPoolTotal', {
            type: DataTypes.FLOAT
          }, { transaction: t }),
          queryInterface.addColumn('UniPools', 'tokenPoolTotal', {
            type: DataTypes.FLOAT
          }, { transaction: t }),
          queryInterface.addColumn('UniPools', 'totalSell', {
            type: DataTypes.INTEGER
          }, { transaction: t }),
          queryInterface.addColumn('UniPools', 'totalBuy', {
            type: DataTypes.INTEGER
          }, { transaction: t }),
          queryInterface.addColumn('UniPools', 'lastBlockCheck', {
            type: DataTypes.INTEGER
          }, { transaction: t }),
      ])
    })
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
