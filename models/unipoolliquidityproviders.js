'use strict';
module.exports = (sequelize, DataTypes) => {
  const UniPoolLiquidityProviders = sequelize.define('UniPoolLiquidityProviders', {
    pool_id: DataTypes.INTEGER
  }, {});
  UniPoolLiquidityProviders.associate = function(models) {
    // associations can be defined here
    UniPoolLiquidityProviders.belongsTo(models.UniPool, {
      foreignKey: 'pool_id',
      onDelete: 'CASCADE'
    });
  };
  return UniPoolLiquidityProviders;
};