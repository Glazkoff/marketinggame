"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class GameConfig extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  GameConfig.init(
    {
      config_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      event_chance: {
        type: DataTypes.DECIMAL,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "GameConfig"
    }
  );
  return GameConfig;
};
