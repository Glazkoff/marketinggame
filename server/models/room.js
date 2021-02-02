"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Room.belongsTo(models.User, {
        foreignKey: "owner_id",
        as: "owner"
      });
      Room.hasMany(models.Review, {
        onDelete: "cascade",
        foreignKey: "room_id",
        as: "reviews"
      });
      Room.hasMany(models.User, {
        foreignKey: "last_room",
        as: "last_room_users"
      });
      Room.hasMany(models.UserInRoom, {
        onDelete: "cascade",
        foreignKey: "room_id",
        as: "users_in_room"
      });
      Room.belongsToMany(models.User, {
        through: models.UserInRoom,
        foreignKey: "room_id"
      });
      Room.hasMany(models.Winner, {
        foreignKey: "room_id",
        as: "winners"
      });
    }
  }
  Room.init(
    {
      room_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      owner_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      is_start: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      is_finished: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      budget_per_month: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      current_month: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      kicked_participants_id: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      // --------------------------
      // TODO: Ниже удалить
      participants_id: {
        // TODO: отказаться от participants_id
        type: DataTypes.JSONB,
        allowNull: false
      },
      first_params: {
        // TODO: заменить моделью RoomsFirstParams
        type: DataTypes.JSONB,
        allowNull: false
      },
      users_steps_state: {
        // TODO: заменить моделью UsersStepsStates
        type: DataTypes.ARRAY(DataTypes.JSONB),
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: "Room"
    }
  );
  return Room;
};
