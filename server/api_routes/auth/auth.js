const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JWTCONFIG = require("../../secret.config");
const db = require("../../models/index");
const { logRestApiError } = require("../../global_functions/logs");

// Создание соли для хеширования
const salt = bcrypt.genSaltSync(10);

// Авторизация
router.post("/login", (req, res) => {
  try {
    // #region Проверка на пустые данные
    if (!req.body.login || !req.body.password) {
      res.status(400).send({
        status: 400,
        message: "Пустой запрос!"
      });
    }
    // #endregion

    // #region Запрос на вытаскивание данных о пользователе
    else {
      db.User.findOne({
        where: {
          login: req.body.login
        }
      })
        // #endregion
        .then(user => {
          // #region Проверка на существование пользователя
          if (!user) {
            res.status(404).send({
              status: 404,
              message: "Неправильный логин или пароль!"
            });
          }
          // #endregion
          else {
            // #region Сравнение полученных и введенных паролей
            bcrypt.compare(req.body.password, user.password, function(
              err,
              result // #endregion
            ) {
              // #region Если расшифровка не удалась
              if (err) {
                console.log("Ошибка расшифровки: ", err);
                res.status(500).send({
                  status: 500,
                  message: err
                });
              }
              // #endregion
              else if (result) {
                // #region Создание токена найденного пользователя
                const accessToken = jwt.sign(
                  {
                    id: user.user_id,
                    name: user.name,
                    admin: user.admin
                  },
                  JWTCONFIG.SECRET
                );
                res.send({
                  status: 202,
                  message: "Пользователь найден",
                  token: accessToken
                });
                // #endregion
              }
              // #region Пользователь не найден
              else {
                res.status(404).send({
                  status: 404,
                  message: "Неправильный логин или пароль"
                });
              }
              // #endregion
            });
          }
        })
        .catch(err => console.log(err));
    }
  } catch (error) {
    logRestApiError("auth", error);
    res.status(500).send({
      status: 500,
      message: "Ошибка авторизации!"
    });
  }
});

// Зарегистрироваться
router.post("/register", (req, res) => {
  try {
    if (!req.body.login || !req.body.password || !req.body.name) {
      res.status(400).send({
        status: 400,
        message: "Пустой запрос!"
      });
    } else {
      db.User.findOne({
        where: {
          login: req.body.login
        }
      })
        .then(user => {
          if (user) {
            console.log("FUCK!", user);
            res.status(403).send({
              status: 403,
              message: "Пользователь с таким логином уже существет!"
            });
          } else {
            db.User.create({
              login: req.body.login,
              password: bcrypt.hashSync(req.body.password, salt),
              name: req.body.name
            })
              .then(user => {
                res.send({
                  status: 202,
                  user: user.dataValues
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).send({
                  status: 500,
                  message: "Ошибка сервера!"
                });
              });
          }
        })
        .catch(err => {
          console.log(err);
          res.status(500).send({
            status: 500,
            message: "Ошибка сервера!"
          });
        });
    }
  } catch (error) {
    logRestApiError("auth", error);
    res.status(500).send({
      status: 500,
      message: "Ошибка регистрации!"
    });
  }
});

module.exports = router;
