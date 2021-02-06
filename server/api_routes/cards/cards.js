const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const JWTCONFIG = require("../../secret.config");
const db = require("../../models/index");
const { logRestApiError } = require("../../global_functions/logs");
const { getOneOffCardsId } = require("../../global_functions/game_process");

// Получение данных о всех карточках
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
          let result = await db.Card.findAll({
            attributes: [
              ["card_id", "id"],
              "title",
              "text",
              "coefs",
              "templateText",
              "cost",
              "duration",
              "oneOff"
            ],
            order: [["card_id", "ASC"]]
          });
          res.send(result);
        }
      }
    );
  } catch (error) {
    logRestApiError("cards", error);
    res.status(500).send({
      status: 500,
      message: "Ошибка получения данных о всех карточках!"
    });
  }
});

// FIXME: уточнить, используется ли
// Получение данных о конкретной карточке
router.get("/id/:id", async (req, res) => {
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
          let result = await db.Card.findOne({
            where: {
              card_id: req.params.id
            },
            order: [["updatedAt", "DESC"]]
          });
          res.send(result);
        }
      }
    );
  } catch (error) {
    logRestApiError("cards", error);
    res.status(500).send({
      status: 500,
      message: "Ошибка получения данных о конкретной карточке"
    });
  }
});

// Получение списка одноразовых карточек
router.get("/oneoff", async (req, res) => {
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
          let result = await getOneOffCardsId(db.Card);
          res.send(result);
        }
      }
    );
  } catch (error) {
    logRestApiError("cards", error);
    res.status(500).send({
      status: 500,
      message: "Ошибка получения списка одноразовых карточек"
    });
  }
});

module.exports = router;