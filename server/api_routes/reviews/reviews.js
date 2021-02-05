const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const JWTCONFIG = require("../../secret.config");
const db = require("../../models/index");
const { logRestApiError } = require("../../global_functions/logs");

// Список всех отзывов
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
          let result = await db.Review.findAll({
            order: [["updatedAt", "DESC"]],
            include: [
              {
                model: db.User,
                as: "user"
              }
            ]
          });
          res.send(result);
        }
      }
    );
  } catch (error) {
    logRestApiError("reviews", error);
    res.status(500).send({
      status: 500,
      message: "Ошибка сервера!"
    });
  }
});

// Добавить отзыв
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
          let result = await db.Review.create({
            author_id: decoded.id,
            room_id: req.body.room_id,
            rating: req.body.rating,
            comment: req.body.comment
          });
          res.send(result);
        }
      }
    );
  } catch (error) {
    logRestApiError("reviews", error);
    res.status(500).send({
      status: 500,
      message: "Ошибка сервера!"
    });
  }
});

// Получить конкретный отзыв
router.get("/:id", async (req, res) => {
  try {
    let result = await db.Review.findOne({
      where: {
        review_id: req.params.id
      }
    });
    res.send(result);
  } catch (error) {
    logRestApiError("reviews", error);
    res.status(500).send({
      status: 500,
      message: "Ошибка сервера!"
    });
  }
});

// Удалить отзыв
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
          await db.Review.destroy({
            where: {
              review_id: req.params.id
            }
          });
          res.sendStatus(200);
        }
      }
    );
  } catch (error) {
    logRestApiError("reviews", error);
    res.status(500).send({
      status: 500,
      message: "Ошибка сервера!"
    });
  }
});

module.exports = router;
