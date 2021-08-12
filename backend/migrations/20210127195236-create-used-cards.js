"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("UsedCards", {
      used_cards_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_in_room_id: {
        type: Sequelize.INTEGER,
        alowNull: false
      },
      card_id: {
        type: Sequelize.INTEGER,
        alowNull: false
      },
      amount: {
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
    await queryInterface.dropTable("UsedCards");
  }
};
