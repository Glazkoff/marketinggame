"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MoneyResultState extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      MoneyResultState.belongsTo(models.UserStepState, {
        foreignKey: "step_state_id",
        as: "step_state"
      });
    }
  }
  MoneyResultState.init(
    {
      money_result_state_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      step_state_id: {
        type: DataTypes.INTEGER,
        alowNull: false
      },
      money_for_month: {
        type: DataTypes.INTEGER,
        alowNull: false
      }
    },
    {
      sequelize,
      modelName: "MoneyResultState"
    }
  );
  return MoneyResultState;
};
