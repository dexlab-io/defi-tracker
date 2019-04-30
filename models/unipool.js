'use strict';
module.exports = (sequelize, DataTypes) => {
  const UniPool = sequelize.define('UniPool', {
    timestamps: true,
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    exchangeAddress: DataTypes.STRING,
    symbol: DataTypes.STRING,
    erc20Address: DataTypes.STRING,
    createdAt: {
      type: DataTypes.TIMESTAMP,
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