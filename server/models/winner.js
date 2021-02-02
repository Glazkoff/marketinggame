"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Winner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Winner.belongsTo(models.Room, {
        foreignKey: "room_id",
        as: "winners_room"
      });
    }
  }
  Winner.init(
    {
      winners_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      room_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      money: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      place: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "Winner"
    }
  );
  return Winner;
};
