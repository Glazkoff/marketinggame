"use strict";
const express = require("express");
const serveStatic = require("serve-static");
const bodyParser = require("body-parser");
const Sequelize = require("sequelize");
const path = require("path");
const morgan = require("morgan");
const compression = require("compression");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const DBCONFIG = require("./db.config");
const JWTCONFIG = require("./secret.config");
const chalk = require("chalk");
const helmet = require("helmet");
const history = require("connect-history-api-fallback");

const cors = require("cors");
const {
  logSocketState,
  logSocketOutEvent
} = require("./global_functions/logs");
const { getOneOffCardsId } = require("./global_functions/game_process");

// База данных
const db = require("./models/index");

const app = express();
let port = process.env.PORT || 3001;

if (process.env.PORT) {
  // Корректная работа режима HTML5 history

  // Настрйока безоопасности
  app.use(helmet());
}

// Сжатие gzip
app.use(compression());

// Настройка CORS
app.use(cors());

// Парсинг json - application/json
app.use(bodyParser.json());

// Парсинг запросов по типу: application/x-www-form-urlencoded
app.use(
  express.urlencoded({
    extended: true
  })
);

// Логирование запросов
// Формат: МЕТОД url_адрес - Статус: код_статуса - длина_ответа - время_выполнения
app.use(
  morgan(
    chalk.bold.red(":method") +
      " " +
      chalk.blueBright(":url") +
      " - Статус: " +
      chalk.yellow(":status") +
      "  :res[content-length] - :response-time ms"
  )
);

// app.get(/.*/, function(req, res) {
//   res.sendFile(path.join(__dirname, "../dist/index.html"));
// });

// Создание соли для хеширования
const salt = bcrypt.genSaltSync(10);

// Создание подключения с БД
// const sequelize = new Sequelize(DBCONFIG.DB, DBCONFIG.USER, DBCONFIG.PASSWORD, {
//   dialect: "postgres",
//   host: DBCONFIG.HOST,
//   logging: false // TODO: УБРАТЬ
// });

// Синхронизация таблиц с БД
// sequelize
//   // .sync({
//   //   force: true
//   // })
//   .sync({
//     alter: true
//   })
//   // .sync()
//   .then(result => {
//     // db.User.create({
//     //   login: "login",
//     //   password: bcrypt.hashSync("password", salt),
//     //   name: "Никита"
//     // })
//     //   .then(res => {
//     //     console.log(res.dataValues);
//     //   })
//     //   .catch(err => console.log(err));
//     trySetCards();
//     trySetEvents();
//     console.log("Подключено к БД");
//   })
//   .catch(err => console.log("Ошибка подключения к БД", err));

// Константы
const CARDS = require("./cards");
const EVENTS = require("./events");
const DEFAULTROOMS = require("./defaultrooms");

// const ONEWAYCARDS = require("./onewaycards.js");

async function trySetCards() {
  // await Cards.destroy({ where: {} });
  for (let card of CARDS) {
    let findCard = await db.Card.findOne({
      where: {
        card_id: card.id
      }
    });
    if (JSON.stringify(findCard) === "null") {
      db.Card.create({
        card_id: card.id,
        title: card.title,
        text: card.text,
        cost: card.cost,
        coefs: card.coefs,
        templateText: card.templateText,
        duration: card.duration,
        data_change: card.data_change,
        oneOff: card.oneOff
      });
    }
  }
}

async function trySetEvents() {
  // await Events.destroy({ where: {} });
  for (let event of EVENTS) {
    let findEvent = await db.Event.findOne({
      where: {
        event_id: event.id
      }
    });
    if (JSON.stringify(findEvent) === "null") {
      db.Event.create({
        event_id: event.id,
        title: event.title,
        description: event.description,
        data_change: event.data_change
      });
    }
  }
}

/** ************************** Модуль API *********************** */

// Список всех пользователей
app.get("/api/admin/users/list", async (req, res) => {
  // await jwt.verify(
  //   req.headers.authorization,
  //   JWTCONFIG.SECRET,
  //   async (err, decoded) => {
  //     if (err) {
  //       res.status(401).send({
  //         status: 401,
  //         message: "Вы не авторизованы!"
  //       });
  //     } else {
  let result = await db.User.findAll({
    attributes: ["user_id", "login", "name", "createdAt"],
    order: [["updatedAt", "DESC"]]
  });
  res.send({
    users: result
  });
  // }
  // }
  // );
});

app.get("/api/admin/globalconfig", async (req, res) => {
  // await jwt.verify(
  //   req.headers.authorization,
  //   JWTCONFIG.SECRET,
  //   async (err, decoded) => {
  //     if (err) {
  //       res.status(401).send({
  //         status: 401,
  //         message: "Вы не авторизованы!"
  //       });
  //     } else {
  let lastConfig = await db.GameConfig.findOne({
    limit: 1,
    order: [["createdAt", "DESC"]]
  });
  console.log("lastConfig", lastConfig);
  res.send({
    config: lastConfig.dataValues
  });
});

app.post("/api/admin/globalconfig", async (req, res) => {
  // await jwt.verify(
  //   req.headers.authorization,
  //   JWTCONFIG.SECRET,
  //   async (err, decoded) => {
  //     if (err) {
  //       res.status(401).send({
  //         status: 401,
  //         message: "Вы не авторизованы!"
  //       });
  //     } else {
  let lastConfig = await db.GameConfig.findOne({
    limit: 1,
    order: [["createdAt", "DESC"]]
  });
  let result = await db.GameConfig.create({
    event_chance: req.body.event_chance || lastConfig.event_chance
  });
  res.send(result);
  //     }
  //   }
  // );
});

app.post("/api/addreview", async (req, res) => {
  try {
    let result = await db.Review.create({
      author_id: req.body.author_id,
      room_id: req.body.room_id,
      rating: req.body.rating,
      comment: req.body.comment
    });
    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: 500,
      message: "Ошибка сервера!"
    });
  }
});

app.delete("/api/deletereview/:id", async (req, res) => {
  let result = await db.Review.destroy({
    where: {
      review_id: req.params.id
    }
  });
  res.sendStatus(200).send(result);
});

// ************************************************************************

// Авторизация
app.post("/api/login", (req, res) => {
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
              // console.log(result);
              // #region Создание токена найденного пользователя
              console.log("TOKEN: ", user);
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
});

// Зарегистрироваться
app.post("/api/register", (req, res) => {
  console.log(" app post 1296");
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
});

// Получить комнату по умолчанию
app.get("/api/default/room", (req, res) => {
  res.send(DEFAULTROOMS[0]);
});

// Создание новой команты
app.post("/api/rooms", async (req, res) => {
  console.log("Новая комната 1376");
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
        try {
          let userLastRoomValid = await db.User.findOne({
            where: {
              user_id: decoded.id
            }
          });
          console.log(userLastRoomValid.last_room);
          if (!userLastRoomValid.last_room) {
            let result = await db.Room.create({
              owner_id: decoded.id,
              budget_per_month: req.body.money
            });

            let firstParams = req.body;
            firstParams.room_id = result.dataValues.room_id;
            await db.RoomFirstParams.create(firstParams);
            result.dataValues.first_params = firstParams;

            let uir = await db.UserInRoom.create({
              user_id: decoded.id,
              room_id: result.room_id,
              current_month: result.dataValues.first_params.month
            });
            result.dataValues.first_params.user_in_room_id =
              uir.user_in_room_id;
            await db.GamerRoomParams.create(result.dataValues.first_params);
            await db.PrevRoomParams.create(result.dataValues.first_params);

            result.dataValues.prev_room_params = result.dataValues.first_params;
            result.dataValues.gamer_room_params =
              result.dataValues.first_params;

            // #region Добавление последней комнаты для пользователя
            await db.User.update(
              {
                last_room: result.room_id
              },
              {
                where: {
                  user_id: decoded.id
                }
              }
            ).then(res => {
              console.log(res);
            });
            // #endregion

            res.send(result);
          } else {
            console.log("Комната уже существует, не создавай новые");
            res.send({
              status: 400,
              message:
                "Вы уже находитесь в другой комнате! Ваша последняя комната - " +
                userLastRoomValid.last_room
            });
          }
        } catch (error) {
          console.log("Ошибка создания комнаты", error);
          res.status(500).send({
            status: 500,
            message: "Ошибка создания комнаты!"
          });
        }
      }
    }
  );
});

// Присоединение к комнате
app.post("/api/rooms/join/:id", async (req, res) => {
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
        // Ищем комнату
        let findRoom = await db.Room.findOne({
          where: {
            room_id: req.params.id
          },
          include: [
            {
              model: db.Winner,
              as: "winners"
            },
            {
              model: db.RoomFirstParams,
              as: "first_params"
            }
          ]
        });

        // Проверяем существует ли вообще комната
        if (!findRoom) {
          res.status(404).send({
            status: 404,
            message: "Такой комнаты не существует!"
          });
        } else {
          // Проверяем, не началась ли игра в комнате
          if (!findRoom.is_start) {
            res.status(404).send({
              status: 404,
              message: "Игра в комнате уже началась!"
            });
          } else {
            // Проверяем, не была ли игра завершена
            if (findRoom.is_finished) {
              res.status(400).send({
                status: 400,
                message: "Игра в комнате была завершена!"
              });
            } else {
              // Получаем объект пользователя
              let user = await db.User.findOne({
                where: {
                  user_id: decoded.id
                }
              });

              if (user !== null) {
                // Если не было последней комнаты
                // или последняя комната равняется искомой
                if (!user.last_room || user.last_room === findRoom.room_id) {
                  const Op = Sequelize.Op;

                  // Находим объект, если пользователь выкинут вручную
                  let iskickedUser = await db.Room.findOne({
                    where: {
                      room_id: findRoom.room_id,
                      kicked_participants_id: {
                        [Op.contains]: decoded.id
                      }
                    },
                    include: [
                      {
                        model: db.Winner,
                        as: "winners"
                      },
                      {
                        model: db.RoomFirstParams,
                        as: "first_params"
                      }
                    ]
                  });

                  // Проверяем, если пользователь не выкинут вручную
                  if (!iskickedUser) {
                    // #region Добавление ласт рум к пользователю
                    await db.User.update(
                      {
                        last_room: req.params.id
                      },
                      {
                        where: {
                          user_id: decoded.id
                        }
                      }
                    ).then(res => {
                      console.log(res);
                    });
                    // #endregion

                    // #region Добавление имени для победителей
                    if (findRoom.winners.length !== 0) {
                      for (let index in findRoom.winners) {
                        if (findRoom.winners[index].id !== -1) {
                          let user = await db.User.findOne({
                            where: {
                              user_id: findRoom.winners[index].id
                            }
                          });
                          findRoom.winners[index].name = user.name;
                        }
                      }
                    }
                    // #endregion

                    let participants = await db.UserInRoom.findAll({
                      attributes: ["user_id"],
                      where: {
                        room_id: findRoom
                      }
                    });
                    let participantsArray = participants.map(el => {
                      return el.user_id;
                    });

                    // Является ли участником комнаты
                    let isSet = participantsArray.findIndex(el => {
                      return el === decoded.id;
                    });

                    // Если не является участником комнаты
                    if (isSet === -1) {
                      //  Привязать пользователя к комнате и установить все параметры
                      let userInRoom = await db.UserInRoom.create({
                        user_id: decoded.id,
                        room_id: req.params.id,
                        current_month: findRoom.first_params.month
                      });
                      findRoom.first_params.user_in_room_id =
                        userInRoom.user_in_room_id;
                      let grp = await db.GamerRoomParams.create(
                        findRoom.first_params
                      );
                      let prp = await db.PrevRoomParams.create(
                        findRoom.first_params
                      );
                      userInRoom.gamer_room_params = grp.dataValues;
                      userInRoom.prev_room_params = prp.dataValues;

                      findRoom.dataValues.first_params =
                        userInRoom.gamer_room_params;
                      findRoom.dataValues.prev_room_params =
                        userInRoom.prev_room_params;
                      findRoom.dataValues.gamer_room_params =
                        userInRoom.gamer_room_params;

                      res.send(findRoom.dataValues);
                    }
                    //  Если уже является участником комнаты
                    else {
                      // Находим связку пользователя и комнаты
                      let userInRoom = await db.UserInRoom.findOne({
                        where: {
                          user_id: decoded.id,
                          room_id: req.params.id
                        },
                        include: [
                          {
                            model: db.GamerRoomParams,
                            as: "gamer_room_params"
                          },
                          {
                            model: db.PrevRoomParams,
                            as: "prev_room_params"
                          }
                        ]
                      });
                      findRoom.dataValues.first_params =
                        userInRoom.gamer_room_params.dataValues;
                      findRoom.dataValues.prev_room_params =
                        userInRoom.prev_room_params.dataValues;
                      findRoom.dataValues.gamer_room_params =
                        userInRoom.gamer_room_params.dataValues;

                      // Устанавливаем, что пользователь подключён к комнате
                      await db.UserInRoom.update(
                        {
                          isdisconnected: false
                        },
                        {
                          where: {
                            user_in_room_id: userInRoom.user_in_room_id
                          }
                        }
                      );

                      // Находим пользователя в комнате
                      let usersInRoom = await db.UserInRoom.findAll({
                        where: {
                          room_id: req.params.id
                        },
                        attributes: ["isattacker", "isdisconnected"],
                        include: [
                          {
                            model: db.User,
                            as: "user",
                            attributes: ["user_id", "name"]
                          }
                        ]
                      });

                      // Формируем объект пользователей для фронтенда
                      let gamersObj = [];
                      if (usersInRoom.length !== 0) {
                        usersInRoom.forEach(el => {
                          gamersObj.push({
                            id: el.user.user_id,
                            name: el.user.name,
                            isattacker: el.isattacker,
                            isdisconnected: el.isdisconnected
                          });
                        });
                      }
                      let gamerNamesObj = {
                        gamers: gamersObj
                      };

                      io.in(req.params.id).emit("setGamers", gamerNamesObj);
                      res.send(findRoom.dataValues);
                    }

                    // Находим комнату
                    findRoom = await db.Room.findOne({
                      where: { room_id: findRoom.room_id },
                      include: [
                        {
                          model: db.Winner,
                          as: "winners"
                        },
                        {
                          model: db.RoomFirstParams,
                          as: "first_params"
                        }
                      ]
                    });

                    // Находим пользователя в комнате
                    let usersInRoom = await db.UserInRoom.findAll({
                      where: {
                        room_id: findRoom.room_id
                      },
                      attributes: ["isattacker", "isdisconnected"],
                      include: [
                        {
                          model: db.User,
                          as: "user",
                          attributes: ["user_id", "name"]
                        }
                      ]
                    });

                    // Формируем объект пользователей для фронтенда
                    let gamersObj = [];
                    if (usersInRoom.length !== 0) {
                      usersInRoom.forEach(el => {
                        gamersObj.push({
                          id: el.user.user_id,
                          name: el.user.name
                        });
                      });
                    }
                    let gamerNamesObj = {
                      gamers: gamersObj
                    };
                    io.in(findRoom.room_id).emit("setGamers", gamerNamesObj);
                  } else {
                    res.status(400).send({
                      status: 400,
                      message: "Вы были исключены из игры!"
                    });
                  }
                } else {
                  res.status(400).send({
                    status: 400,
                    message:
                      "Вы уже находитесь в другой комнате! Ваша последняя комната - " +
                      user.last_room
                  });
                }
              } else {
                res.status(404).send({
                  status: 404,
                  message: `Пользователь #${decoded.id} не найден `
                });
              }
            }
          }
        }
      }
    }
  );
});

// TODO: присылать события и список игроков
// Попытка переподключения
app.get("/api/rooms/reset", async (req, res) => {
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
        // #region Получение последней комнаты
        let lastRoomId = await db.User.findOne({
          where: {
            user_id: decoded.id
          },
          attributes: ["last_room"]
        });
        lastRoomId = lastRoomId.last_room;

        let room;

        room = await db.Room.findOne({
          where: {
            room_id: lastRoomId
          },
          include: [
            {
              model: db.Winner,
              as: "winners"
            },
            {
              model: db.RoomFirstParams,
              as: "first_params"
            }
          ]
        });

        // #endregion
        if (!room) {
          res.status(401).send({
            status: 401,
            message: "Нет активных игр!"
          });
        } else {
          let userInRoom = await db.UserInRoom.findOne({
            where: {
              user_id: decoded.id,
              room_id: room.room_id
            },
            include: [
              {
                model: db.GamerRoomParams,
                as: "gamer_room_params"
              },
              {
                model: db.PrevRoomParams,
                as: "prev_room_params"
              }
            ]
          });
          if (!userInRoom) {
            res.status(400).send({
              status: 400,
              message: "Нет активных игр!"
            });
          } else {
            let usersState = await db.UserStepState.findAll({
              where: {
                user_in_room_id: userInRoom.user_in_room_id
              }
            });

            if (usersState.length !== 0) {
              // Устанавливаем, что пользователь подключён к комнате
              await db.UserInRoom.update(
                {
                  isdisconnected: false
                },
                {
                  where: {
                    user_in_room_id: userInRoom.user_in_room_id
                  }
                }
              );

              // Находим пользователя в комнате
              let usersInRoom = await db.UserInRoom.findAll({
                where: {
                  user_in_room_id: userInRoom.user_in_room_id
                },
                attributes: ["isattacker", "isdisconnected"],
                include: [
                  {
                    model: db.User,
                    as: "user",
                    attributes: ["user_id", "name"]
                  }
                ]
              });

              // Формируем объект пользователей для фронтенда
              let gamersObj = [];
              if (usersInRoom.length !== 0) {
                usersInRoom.forEach(el => {
                  gamersObj.push({
                    id: el.user.user_id,
                    name: el.user.name
                  });
                });
              }
              let gamerNamesObj = {
                gamers: gamersObj
              };
              io.in(room.room_id).emit("setGamers", gamerNamesObj);

              // #region Добавление имени для победителей в Reset
              if (room.winners) {
                for (let index in room.winners) {
                  if (room.winners[index].id !== -1) {
                    let user = await db.User.findOne({
                      where: {
                        user_id: room.winners[index].id
                      }
                    });
                    room.winners[index].name = user.name;
                  }
                }
              }
              // #endregion

              res.send({
                room_id: room.room_id,
                owner_id: room.owner_id,
                is_start: room.is_start,
                first_params: room.first_params,
                prev_room_params: userInRoom.prev_room_params,
                gamer_room_params: userInRoom.gamer_room_params,
                is_finished: room.is_finished,
                winners: room.winners,
                gamers: gamerNamesObj,
                effects: userInRoom.effects
              });
            } else {
              if (room) {
                res.send({
                  room_id: room.room_id,
                  owner_id: room.owner_id,
                  is_start: room.is_start,
                  first_params: room.first_params,
                  prev_room_params: userInRoom.prev_room_params,
                  gamer_room_params: userInRoom.gamer_room_params,
                  is_finished: room.is_finished,
                  winners: room.winners
                });
              } else {
                res.status(404).send({
                  status: 404,
                  message: "Ошибка сервера"
                });
              }
            }
          }
        }

        // console.log("ПОИСК КОМНАТЫ С УЧАТСНИКОМ: ", findRoom.first_params);
      }
    }
  );
});

// Подключение роутера API
app.use("/api", require("./api_routes/router"));

// Поддержка HTML5 History mode для SPA
app.use(history());

// Запуск сервера на порте
const server = app
  .use("/", serveStatic(path.join(__dirname, "../dist")))
  .listen(port, () => {
    console.log(chalk.yellow("-".repeat(50)));
    console.log(
      chalk.yellow(`Сервер запущен на `) +
        chalk.underline.cyan(`http://localhost:${port}`)
    );
    console.log(chalk.yellow("-".repeat(50)));
    trySetCards();
    trySetEvents();
  });

/** ************************************************************* */
// Создание сервера Socket.io
const io = require("socket.io")(server);

let connections = [];
let usersAndSockets = {};

/** ********************************************* **/
/** ******Ниже описаны события Socket.io********* **/
/** ********************************************* **/

// Промежуточный обработчик JWT при подключении сокета
io.use(function(socket, next) {
  if (socket.handshake.query && socket.handshake.query.token) {
    jwt.verify(socket.handshake.query.token, JWTCONFIG.SECRET, function(
      err,
      decoded
    ) {
      if (err) {
        return next(new Error("Authentication error"));
      }
      socket.decoded_token = decoded;
      next();
    });
  } else {
    next(new Error("Authentication error"));
  }
});

// Обработка каждого подключения сокета
io.on("connection", async socket => {
  // Логируем подключение токена
  logSocketState("connection", "Пользователь подключён");

  // Декодируем данные токена при подключении
  socket.decoded_token = await jwt.decode(socket.handshake.query.token);

  // Подписка на канал пользователя
  socket.join("user" + socket.decoded_token.id, () => {
    // Логируем подписку на канал пользователя
    logSocketState(
      `join 'user${socket.decoded_token.id}'`,
      "Подписка на канал пользователя"
    );

    // Спрашиваем в комнате ли пользователь
    io.in("user" + socket.decoded_token.id).emit("askIfInTheRoom");

    // Логируем исходящее событие
    logSocketOutEvent("askIfInTheRoom", "Спрашиваем в комнате ли пользователь");
  });

  // Сокет авторизован, можем обрабатывать события от него
  connections.push(socket.id);
  usersAndSockets[socket.decoded_token.id] = socket.id;

  // Отправка тоаста для всех пользователей
  require("./socket_events/add_toast")(socket, io);

  // При отправке игроком сообщения
  require("./socket_events/new_message")(socket, io);

  // Прикрепление пользователя к комнате
  require("./socket_events/subscribe_room")(socket, io, db);

  // Удалить пользователя из комнаты
  require("./socket_events/kick_user")(socket, io, db);

  // При выходе из комнаты
  require("./socket_events/room_leave")(socket, io, db);

  // При старте игры в комнате
  require("./socket_events/start_game")(socket, io, db);

  // При принудительном завершении хода
  require("./socket_events/manual_step_close")(socket, io, db, Sequelize);

  // При выполнении хода
  // TODO: Добавить адекватную работу с db.Card
  require("./socket_events/do_step")(socket, io, db, db.Card);

  // При потере подключения
  require("./socket_events/disconnect")(socket, io, db);
});
