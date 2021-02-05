const express = require("express");
const router = express.Router;
const jwt = require("jsonwebtoken");
const JWTCONFIG = require("../../../secret.config");
const db = require("../../../models/index");
const { logRestApiError } = require("../../../global_functions/logs");

// Получение данных обо всех случайных событиях для администратора
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
          let result = await db.Event.findAll({
            attributes: [
              ["event_id", "id"],
              "title",
              "description",
              "data_change",
              "createdAt",
              "updatedAt"
            ],
            order: [["event_id", "ASC"]]
          });
          res.send(result);
        }
      }
    );
  } catch (error) {
    logRestApiError("events", error);
    res.status(500).send({
      status: 500,
      message: "Ошибка сервера!"
    });
  }
});

// Добавление, редактирование или удаление параметра события
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
          let findEvent = await db.Event.findOne({
            where: {
              event_id: req.params.id
            }
          });
          if (JSON.stringify(findEvent) !== "{}") {
            let findEventParamIndex = findEvent.data_change.findIndex(el => {
              return el.param === req.body.param && el.when === req.body.when;
            });
            if (findEventParamIndex !== -1) {
              if (req.body.toDelete) {
                findEvent.data_change.splice(findEventParamIndex, 1);
              } else {
                findEvent.data_change[findEventParamIndex] = newParam;
              }
            } else {
              newParam.from = `${findEvent.title} ${newParam.when}`;
              findEvent.data_change.push(newParam);
            }
            let a = await db.Event.update(
              {
                data_change: findEvent.data_change
              },
              {
                where: {
                  event_id: req.params.id
                }
              }
            );
            res.send(a);
          }
        }
      }
    );
  } catch (error) {
    logRestApiError("events", error);
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
    logRestApiError("events", error);
    res.status(500).send({
      status: 500,
      message: "Ошибка сервера!"
    });
  }
});

module.exports = router;
