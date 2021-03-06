"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Rooms", {
      room_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      owner_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      is_start: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      is_finished: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      budget_per_month: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      current_month: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      kicked_participants_id: {
        type: Sequelize.JSONB,
        allowNull: true
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
    await queryInterface.dropTable("Rooms");
  }
};
