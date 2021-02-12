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
              "is_draft",
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

// Создание новой тестовой карточки через админпанель
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
          db.Card.create({
            title: "Название новой карточки",
            text: "Текст новой карточки",
            templateText: "",
            cost: 10000,
            duration: 3,
            oneOff: true,
            is_draft: true,
            data_change: []
          });
          res.send({ status: 200, message: "OK" });
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

// Удаление карточки через админпанель
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
          await db.Card.destroy({
            where: {
              card_id: req.params.id
            }
          });
          res.send({ message: "OK", status: 200 });
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

// Добавление, редактирование или удаление параметра карточки
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
          console.log(req.body);
          if (req.body.is_draft != null) {
            let a = await db.Card.update(
              {
                is_draft: req.body.is_draft
              },
              {
                where: {
                  card_id: req.params.id
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

// Обновление статуса карточки: одно- или многоразовая
router.post("/:id/oneoff", async (req, res) => {
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
          let result = await db.Card.update(
            {
              title: req.body.title,
              description: req.body.description,
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
