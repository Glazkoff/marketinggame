const express = require("express");
const router = express.Router();
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
              "is_draft",
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

// Добавление нового тестового случайного события
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
          let result = await db.Event.create({
            title: "Тестовое событие",
            description: "Описание тестового события",
            data_change: [],
            is_draft: true
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
router.delete("/:id", async (req, res) => {
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
          await db.Event.destroy({
            where: {
              event_id: req.params.id
            }
          });
          res.send({ message: "OK", status: 200 });
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

// Сделать черновиком или опубликовать событие
router.put("/:id/is_draft", async (req, res) => {
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
          if (req.body.is_draft != null) {
            let a = await db.Event.update(
              {
                is_draft: req.body.is_draft
              },
              {
                where: {
                  event_id: req.params.id
                }
              }
            );
            res.send(a);
          } else {
            throw new Error("is_draft is not stated!");
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

// Изменение описания события через админпанель
router.put("/:id/description", async (req, res) => {
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
          let result = await db.Event.update(
            {
              title: req.body.title,
              description: req.body.description
            },
            {
              where: {
                event_id: req.params.id
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
