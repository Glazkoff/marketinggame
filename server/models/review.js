"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Review.belongsTo(models.User, {
        foreignKey: "author_id",
        as: "user"
      });
    }
  }
  Review.init(
    {
      review_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      author_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      room_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "Review"
    }
  );
  return Review;
};
