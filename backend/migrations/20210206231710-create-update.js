"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Updates", {
      update_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      version_major: {
        type: Sequelize.INTEGER,
        alowNull: false
      },
      version_minor: {
        type: Sequelize.INTEGER,
        alowNull: false
      },
      version_patch: {
        type: Sequelize.INTEGER,
        alowNull: false
      },
      content: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable("Updates");
  }
};
