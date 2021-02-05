const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const JWTCONFIG = require("../../../secret.config");
const db = require("../../../models/index");
const { logRestApiError } = require("../../../global_functions/logs");

// Получение данных обо всех карточек для администратора
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
              "oneOff",
              "data_change",
              "createdAt",
              "updatedAt"
            ],
            order: [["card_id", "ASC"]]
          });
          res.send(result);
        }
      }
    );
  } catch (error) {
    logRestApiError("admin/cards", error);
    res.status(500).send({
      status: 500,
      message: "Ошибка сервера!"
    });
  }
});

// Добавление, редактирование или удаление параметра карточки
router.post("/:id", async (req, res) => {
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
          let newParam = req.body;
          let findCard = await db.Card.findOne({
            where: {
              card_id: req.params.id
            }
          });
          if (findCard !== null) {
            let findCardParamIndex = findCard.data_change.findIndex(el => {
              return el.param === req.body.param && el.when === req.body.when;
            });
            if (findCardParamIndex !== -1) {
              if (req.body.toDelete) {
                findCard.data_change.splice(findCardParamIndex, 1);
              } else {
                findCard.data_change[findCardParamIndex] = newParam;
              }
            } else {
              newParam.from = `${findCard.title} ${newParam.when}`;
              findCard.data_change.push(newParam);
            }
            let a = await db.Card.update(
              {
                data_change: findCard.data_change
              },
              {
                where: {
                  card_id: req.params.id
                }
              }
            );
            res.send(a);
          } else {
            logRestApiError("admin/cards", "Карта не найдена!");
            res.status(500).send({
              message: "Error",
              status: 500
            });
          }
        }
      }
    );
  } catch (error) {
    logRestApiError("admin/cards", error);
    res.status(500).send({
      status: 500,
      message: "Ошибка сервера!"
    });
  }
});

// Обновление статуса карточки: одно- или многоразовая
router.post("/oneoff/:id", async (req, res) => {
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
          let result = await db.Card.update(
            {
              oneOff: req.body.oneOff
            },
            {
              where: {
                card_id: req.params.id
              }
            }
          );
          res.send(result);
        }
      }
    );
  } catch (error) {
    logRestApiError("admin/cards", error);
    res.status(500).send({
      status: 500,
      message: "Ошибка сервера!"
    });
  }
});

// Изменение описания карточки через админпанель
router.put("/description/:id", async (req, res) => {
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
          let result = await db.Card.update(
            {
              title: req.body.title,
              coefs: req.body.coefs,
              templateText: req.body.templateText,
              text: req.body.text
            },
            {
              where: {
                card_id: req.params.id
              }
            }
          );
          res.send(result);
        }
      }
    );
  } catch (error) {
    logRestApiError("admin/cards", error);
    res.status(500).send({
      status: 500,
      message: "Ошибка сервера!"
    });
  }
});
module.exports = router;
