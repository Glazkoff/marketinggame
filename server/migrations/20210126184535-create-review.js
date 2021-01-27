"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Reviews", {
      review_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      author_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      room_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: false
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
    await queryInterface.dropTable("Reviews");
  }
};
