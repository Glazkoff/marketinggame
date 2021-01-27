"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserInRoom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserInRoom.belongsTo(models.Room, {
        foreignKey: "room_id",
        as: "room"
      });
      UserInRoom.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user"
      });
    }
  }
  UserInRoom.init(
    {
      users_in_rooms_id: {
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
      // -------------------------------
      // TODO: удалить ниже
      gamer_room_params: {
        // TODO: Заменить на модель GamerRoomParams
        type: DataTypes.JSONB,
        allowNull: false
      },
      prev_room_params: {
        // TODO: Заменить на модель PrevRoomParams
        type: DataTypes.JSONB
      },
      used_cards: {
        // TODO: Заменить на модель UsedCards
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {}
      }
    },
    {
      sequelize,
      modelName: "UserInRoom"
    }
  );
  return UserInRoom;
};
