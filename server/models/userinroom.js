"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserInRoom extends Model {
    static associate(models) {
      UserInRoom.belongsTo(models.Room, {
        foreignKey: "room_id",
        as: "room"
      });
      UserInRoom.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user"
      });
      UserInRoom.hasMany(models.UsedCards, {
        onDelete: "cascade",
        foreignKey: "user_in_room_id",
        as: "used_cards"
      });
      UserInRoom.hasOne(models.GamerRoomParams, {
        onDelete: "cascade",
        foreignKey: "user_in_room_id",
        as: "gamer_room_params"
      });
      UserInRoom.hasOne(models.PrevRoomParams, {
        onDelete: "cascade",
        foreignKey: "user_in_room_id",
        as: "prev_room_params"
      });
      UserInRoom.hasMany(models.UserStepState, {
        onDelete: "cascade",
        foreignKey: "user_in_room_id",
        as: "user_steps_state"
      });
    }
  }
  UserInRoom.init(
    {
      user_in_room_id: {
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
      effects: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: []
      },
      changes: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: []
      },
      isattacker: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      isdisconnected: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: "UserInRoom"
    }
  );
  return UserInRoom;
};
