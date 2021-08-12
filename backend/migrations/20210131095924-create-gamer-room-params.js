"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("GamerRoomParams", {
      gamer_room_params_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      user_in_room_id: {
        type: Sequelize.INTEGER,
        alowNull: false
      },
      first: {
        type: Sequelize.BOOLEAN,
        alowNull: false
      },
      money: {
        type: Sequelize.INTEGER,
        alowNull: false
      },
      month: {
        type: Sequelize.INTEGER,
        alowNull: false
      },
      preset: {
        type: Sequelize.BOOLEAN,
        alowNull: false
      },
      conversion: {
        type: Sequelize.FLOAT,
        alowNull: false
      },
      averageCheck: {
        type: Sequelize.FLOAT,
        alowNull: false
      },
      marginalCost: {
        type: Sequelize.FLOAT,
        alowNull: false
      },
      realCostAttract: {
        type: Sequelize.FLOAT,
        alowNull: false
      },
      smmCoef: {
        type: Sequelize.FLOAT,
        alowNull: false
      },
      smmCount: {
        type: Sequelize.FLOAT,
        alowNull: false
      },
      contextCoef: {
        type: Sequelize.FLOAT,
        alowNull: false
      },
      contextCount: {
        type: Sequelize.FLOAT,
        alowNull: false
      },
      organicCoef: {
        type: Sequelize.FLOAT,
        alowNull: false
      },
      organicCount: {
        type: Sequelize.FLOAT,
        alowNull: false
      },
      socialsCoef: {
        type: Sequelize.FLOAT,
        alowNull: false
      },
      socialsCount: {
        type: Sequelize.FLOAT,
        alowNull: false
      },
      straightCoef: {
        type: Sequelize.FLOAT,
        alowNull: false
      },
      straightCount: {
        type: Sequelize.FLOAT,
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
    await queryInterface.dropTable("GamerRoomParams");
  }
};
