const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const JWTCONFIG = require("../../secret.config");
const db = require("../../models/index");
const {logRestApiError} = require("../../global_functions/logs");
const {getOneOffCardsId} = require("../../global_functions/game_process");

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
            order: [["card_id", "ASC"]],
            where: {
              is_draft: false
            }
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

// Получение данных об использованных одноразовых карточках
router.get("/oneoff/used", async (req, res) => {
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
          // Находим пользователя
          const user = await db.User.findOne({
            where: {
              user_id: decoded.id
            }
          })

          // Если существует последняя комната
          if (user.last_room) {
            const userPref = await db.UserInRoom.findOne({
              where: {
                user_id: decoded.id,
                room_id: user.last_room
              },
              include: {
                model: db.UsedCards,
                as: "used_cards"
              }
            })

            // Находим использованные карточки
            let usedCards = []
            if (userPref.used_cards.length > 0) {
              for (let usedCard of userPref.used_cards) {
                usedCards.push(usedCard.card_id)
              }
            }

            // Находим использованные одноразовые карточки
            const usedOneOffCards = await db.Card.findAll({
              where: {
                card_id: usedCards,
                oneOff: true
              },
              attributes: ['card_id']
            })

            // Запись Id использованных одноразовых карточек
            let usedOneOffCardsId = []
            if (usedOneOffCards.length > 0){
              usedOneOffCards.forEach((card) =>{
                usedOneOffCardsId.push(card.card_id)
              })
            }
            res.send(usedOneOffCardsId)
          }
        }
      }
    );
  } catch
    (error) {
    logRestApiError("cards", error);
    res.status(500).send({
      status: 500,
      message: "Ошибка получения использованных одноразовых карт!"
    });
  }
})
;

module.exports = router;
