const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const JWTCONFIG = require("../../../secret.config");
const db = require("../../../models/index");
const { logRestApiError } = require("../../../global_functions/logs");

// Получение всех комнат для админпанели
router.get("/", async (req, res) => {
  try {
    await jwt.verify(
      req.headers.authorization,
      JWTCONFIG.SECRET,
      async (err, decoded) => {
        if (err) {
          res.status(401).send({
            status: 401,
            message: "Вы не авторизованы!"
          });
        } else {
          let result = await db.Room.findAll({
            order: [["room_id", "DESC"]],
            include: [
              {
                model: db.Winner,
                as: "winners"
              },
              {
                model: db.RoomFirstParams,
                as: "first_params"
              }
            ]
          });
          res.send(result);
        }
      }
    );
  } catch (error) {
    logRestApiError("admin/rooms", error);
    res.status(500).send({
      status: 500,
      message: "Ошибка сервера!"
    });
  }
});

// Получение конкретной комнаты для админпанели
router.get("/:id", async (req, res) => {
  try {
    await jwt.verify(
      req.headers.authorization,
      JWTCONFIG.SECRET,
      async (err, decoded) => {
        if (err) {
          res.status(401).send({
            status: 401,
            message: "Вы не авторизованы!"
          });
        } else {
          let result = await db.Room.findAll({
            where: {
              room_id: req.params.id
            },
            include: [
              {
                model: db.Winner,
                as: "winners"
              },
              {
                model: db.RoomFirstParams,
                as: "first_params"
              }
            ]
          });
          res.send(result);
        }
      }
    );
  } catch (error) {
    logRestApiError("admin/rooms", error);
    res.status(500).send({
      status: 500,
      message: "Ошибка сервера!"
    });
  }
});

// Получение всех пользователей комнаты для админпанели
router.get("/:id/users", async (req, res) => {
  await jwt.verify(
    req.headers.authorization,
    JWTCONFIG.SECRET,
    async (err, decoded) => {
      if (err) {
        res.status(401).send({
          status: 401,
          message: "Вы не авторизованы!"
        });
      } else {
        let result = await db.UserInRoom.findAll({
          where: {
            room_id: req.params.id
          },
          include: [
            {
              model: db.GamerRoomParams,
              as: "gamer_room_params"
            },
            {
              model: db.PrevRoomParams,
              as: "prev_room_params"
            },
            {
              model: db.UsedCards,
              as: "used_cards"
            }
          ]
        });
        res.send(result);
      }
    }
  );
});

module.exports = router;
