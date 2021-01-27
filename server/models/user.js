"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Review, {
        onDelete: "cascade",
        foreignKey: "author_id",
        as: "reviews"
      });
      User.hasMany(models.Room, {
        onDelete: "cascade",
        foreignKey: "owner_id",
        as: "own_rooms"
      });
    }
  }
  User.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      login: {
        type: DataTypes.STRING,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      last_room: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: "User"
    }
  );
  return User;
};