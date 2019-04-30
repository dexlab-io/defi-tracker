'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('UniPools', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      exchangeAddress: {
        type: Sequelize.STRING
      },
      symbol: {
        type: Sequelize.STRING
      },
      erc20Address: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    })
    .then(() => queryInterface.sequelize.query('ALTER TABLE `UniPools` CHANGE `createdAt` `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;'))
    .then(() => queryInterface.sequelize.query('ALTER TABLE `UniPools` CHANGE `updatedAt` `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;'));

  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('UniPools');
  }
};