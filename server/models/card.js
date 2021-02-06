"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Card extends Model {
    static associate(models) {
      Card.hasMany(models.UsedCards, {
        onDelete: "cascade",
        foreignKey: "card_id",
        as: "used_cards"
      });
    }
  }
  Card.init(
    {
      card_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      coefs: {
        type: DataTypes.JSONB,
        defaultValue: []
      },
      templateText: {
        type: DataTypes.TEXT
      },
      cost: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      duration: {
        type: DataTypes.INTEGER
      },
      data_change: {
        type: DataTypes.JSONB,
        allowNull: false
      },
      oneOff: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      sequelize,
      modelName: "Card"
    }
  );
  return Card;
};
