const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const JWTCONFIG = require("../../../secret.config");
const db = require("../../../models/index");
const { logRestApiError } = require("../../../global_functions/logs");

// Запись глобальной конфигурации для админпанели
router.post("/", async (req, res) => {
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
          let lastConfig = await db.GameConfig.findOne({
            limit: 1,
            order: [["createdAt", "DESC"]]
          });
          console.log("TRY CATCH ERROR: " + req.body);
          let result = await db.GameConfig.create({
            event_chance: req.body.event_chance || lastConfig.event_chance,
            display_subscriptions: req.body.display_subscriptions,
            display_rating: req.body.display_rating
          });
          res.send(result);
        }
      }
    );
  } catch (error) {
    logRestApiError("admin/config", error);
    res.status(500).send({
      status: 500,
      message: "Ошибка сервера!"
    });
  }
});

// Получение глобальной конфигурации для админпанели
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
          // TODO: fix error
          let result = await db.GameConfig.findOne({
            limit: 1,
            order: [["createdAt", "DESC"]]
          });
          res.send(result);
        }
      }
    );
  } catch (error) {
    logRestApiError("admin/config", error);
    res.status(500).send({
      status: 500,
      message: "Ошибка сервера!"
    });
  }
});

module.exports = router;
