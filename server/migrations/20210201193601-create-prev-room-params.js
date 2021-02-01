"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("PrevRoomParams", {
      prev_room_params_id: {
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
        type: Sequelize.INTEGER,
        alowNull: false
      },
      marginalCost: {
        type: Sequelize.INTEGER,
        alowNull: false
      },
      realCostAttract: {
        type: Sequelize.INTEGER,
        alowNull: false
      },
      smmCoef: {
        type: Sequelize.FLOAT,
        alowNull: false
      },
      smmCount: {
        type: Sequelize.INTEGER,
        alowNull: false
      },
      contextCoef: {
        type: Sequelize.FLOAT,
        alowNull: false
      },
      contextCount: {
        type: Sequelize.INTEGER,
        alowNull: false
      },
      organicCoef: {
        type: Sequelize.FLOAT,
        alowNull: false
      },
      organicCount: {
        type: Sequelize.INTEGER,
        alowNull: false
      },
      socialsCoef: {
        type: Sequelize.FLOAT,
        alowNull: false
      },
      socialsCount: {
        type: Sequelize.INTEGER,
        alowNull: false
      },
      straightCoef: {
        type: Sequelize.FLOAT,
        alowNull: false
      },
      straightCount: {
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
    await queryInterface.dropTable("PrevRoomParams");
  }
};
