"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class GamerRoomParams extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  GamerRoomParams.init(
    {
      gamer_room_params_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      user_in_room_id: {
        type: DataTypes.INTEGER,
        alowNull: false
      },
      first: {
        type: DataTypes.BOOLEAN,
        alowNull: false
      },
      money: {
        type: DataTypes.INTEGER,
        alowNull: false
      },
      month: {
        type: DataTypes.INTEGER,
        alowNull: false
      },
      preset: {
        type: DataTypes.BOOLEAN,
        alowNull: false
      },
      conversiion: {
        type: DataTypes.FLOAT,
        alowNull: false
      },
      averageCheck: {
        type: DataTypes.INTEGER,
        alowNull: false
      },
      marginalCost: {
        type: DataTypes.INTEGER,
        alowNull: false
      },
      realCostAttract: {
        type: DataTypes.INTEGER,
        alowNull: false
      },
      smmCoef: {
        type: DataTypes.FLOAT,
        alowNull: false
      },
      smmCount: {
        type: DataTypes.INTEGER,
        alowNull: false
      },
      contextCoef: {
        type: DataTypes.FLOAT,
        alowNull: false
      },
      contextCount: {
        type: DataTypes.INTEGER,
        alowNull: false
      },
      organicCoef: {
        type: DataTypes.FLOAT,
        alowNull: false
      },
      organicCount: {
        type: DataTypes.INTEGER,
        alowNull: false
      },
      socialsCoef: {
        type: DataTypes.FLOAT,
        alowNull: false
      },
      socialsCount: {
        type: DataTypes.INTEGER,
        alowNull: false
      },
      straightCoef: {
        type: DataTypes.FLOAT,
        alowNull: false
      },
      straightCount: {
        type: DataTypes.INTEGER,
        alowNull: false
      }
    },
    {
      sequelize,
      modelName: "GamerRoomParams"
    }
  );
  return GamerRoomParams;
};
