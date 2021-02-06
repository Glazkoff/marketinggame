"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Update extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Update.init(
    {
      update_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      version_major: {
        type: DataTypes.INTEGER,
        alowNull: false
      },
      version_minor: {
        type: DataTypes.INTEGER,
        alowNull: false
      },
      version_patch: {
        type: DataTypes.INTEGER,
        alowNull: false
      },
      content: {
        type: DataTypes.TEXT,
        alowNull: false
      }
    },
    {
      sequelize,
      modelName: "Update"
    }
  );
  return Update;
};
