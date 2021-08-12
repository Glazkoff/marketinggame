const express = require("express");
const router = express.Router();
const db = require("../../models/index");
const {
  logRestApiError,
  logSocketOutEvent
} = require("../../global_functions/logs");
const jwt = require("jsonwebtoken");

function getPersonalRouter(io) {
  // Получение полного списка инфорции об обновлениях
  router.get("/lastroom", async (req, res) => {
    try {
      let decodedToken = await jwt.decode(req.headers.authorization);
      let user = await db.User.findOne({
        where: {
          user_id: decodedToken.id
        },
        attributes: ["last_room"]
      });
      res.send(user);
    } catch (error) {
      logRestApiError("updates", error);
      res.status(500).send({
        status: 500,
        message: "Ошибка получения полного списка инфорции об обновлениях!"
      });
    }
  });

  // Выход из последней комнаты
  router.delete("/lastroom", async (req, res) => {
    try {
      let decodedToken = await jwt.decode(req.headers.authorization);
      let user = await db.User.update(
        { last_room: null },
        {
          where: {
            user_id: decodedToken.id
          }
        }
      );

      
      // Отправляем событие пользователю, которого мы хотим выкинуть
      io.in("user" + decodedToken.id).emit("kickUser");
      // Логируем исходящее событие
      logSocketOutEvent("lastroom", "Сообщаем пользователю, что его выкинули");

      res.send(user);
    } catch (error) {
      logRestApiError("updates", error);
      res.status(500).send({
        status: 500,
        message: "Ошибка получения полного списка инфорции об обновлениях!"
      });
    }
  });

  return router;
}

module.exports = getPersonalRouter;
