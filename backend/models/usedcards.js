"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UsedCards extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UsedCards.belongsTo(models.UserInRoom, {
        foreignKey: "user_in_room_id",
        as: "user_in_room"
      });
      UsedCards.belongsTo(models.Card, {
        foreignKey: "card_id",
        as: "card"
      });
    }
  }
  UsedCards.init(
    {
      used_cards_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      user_in_room_id: {
        type: DataTypes.INTEGER,
        alowNull: false
      },
      card_id: {
        type: DataTypes.INTEGER,
        alowNull: false
      },
      amount: {
        type: DataTypes.INTEGER,
        alowNull: false
      }
    },
    {
      sequelize,
      modelName: "UsedCards"
    }
  );
  return UsedCards;
};
