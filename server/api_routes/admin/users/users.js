const express = require("express");
const router = express.Router;
const jwt = require("jsonwebtoken");
const JWTCONFIG = require("../../../secret.config");
const db = require("../../../models/index");
const { logRestApiError } = require("../../../global_functions/logs");

// Получение информации о количестве пользователей
router.get("/count", async (req, res) => {
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
          let result = await db.User.count();
          let obj = {
            count: result
          };
          res.send(obj);
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

// Получение списка пользователей с пагинацией
router.get("/api/admin/users/list/:offset", async (req, res) => {
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
          let result = await db.User.findAll({
            attributes: ["user_id", "login", "name", "createdAt"],
            order: [["updatedAt", "DESC"]],
            offset: 10 * (req.params.offset - 1),
            limit: 10
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

// Удаление записи о пользователе
router.delete("/login/:login", async (req, res) => {
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
          await db.User.destroy({
            where: {
              login: req.params.login
            }
          });
          res.status(200).send({
            message: "ok"
          });
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

// Удаление записи о пользователе
router.delete("/id/:id", async (req, res) => {
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
          await db.User.destroy({
            where: {
              user_id: req.params.id
            }
          });
          res.status(200).send({
            message: "ok"
          });
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
