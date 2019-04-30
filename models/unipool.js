'use strict';
module.exports = (sequelize, DataTypes) => {
  const UniPool = sequelize.define('UniPool', {
    exchangeAddress: DataTypes.STRING,
    symbol: DataTypes.STRING,
    erc20Address: DataTypes.STRING,
    ethPoolTotal: DataTypes.FLOAT,
    tokenPoolTotal: DataTypes.FLOAT,
    totalSell: DataTypes.INTEGER, 
    totalBuy: DataTypes.INTEGER,
    totalVolume: DataTypes.FLOAT,
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('NOW()')
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('NOW()')
    }
  }, {});
  UniPool.associate = function(models) {
    // associations can be defined here
  };
  return UniPool;
};