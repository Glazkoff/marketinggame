const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const JWTCONFIG = require("../../secret.config");
const db = require("../../models/index");
const { logRestApiError } = require("../../global_functions/logs");

// Запрос на триал
router.post("/trial", async (req, res) => {
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
         // TODO: Добавить в базу данных информацию о триалах и сделать проверку

          // res.sendStatus(200)
          res.status(501).send({
            status: 501,
            message: "Функционал пока не реализован!"
          });
        }
      }
    );
  } catch (error) {
    logRestApiError("payment", error);
    res.status(500).send({
      status: 500,
      message: "Ошибка сервера!"
    });
  }
});


module.exports = router;
