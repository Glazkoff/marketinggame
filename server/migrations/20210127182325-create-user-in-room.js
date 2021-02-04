"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("UserInRooms", {
      user_in_room_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      room_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      effects: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: []
      },
      changes: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: []
      },
      isattacker: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      isdisconnected: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
    await queryInterface.dropTable("UserInRooms");
  }
};
