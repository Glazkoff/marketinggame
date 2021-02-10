"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("MoneyResultStates", {
      money_result_state_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      step_state_id: {
        type: Sequelize.INTEGER,
        alowNull: false
      },
      money_for_month: {
        type: Sequelize.INTEGER,
        alowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("MoneyResultStates");
  }
};
