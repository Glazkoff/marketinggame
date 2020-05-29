"use strict";
const express = require("express");
const serveStatic = require("serve-static");
const bodyParser = require("body-parser");
const Sequelize = require("sequelize");
const path = require("path");
const morgan = require("morgan");
const compression = require("compression");
const helmet = require("helmet");
const jwt = require("jsonwebtoken");
const socketioJwt = require('socketio-jwt');
const bcrypt = require("bcrypt");
const DBCONFIG = require("./db.config");
const JWTCONFIG = require("./secret.config");
const app = express();
let port = process.env.PORT || 3001;

// Сжатие gzip
app.use(compression());

// Настрйока безоопасности
// app.use(helmet());

// Настройка CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, PATCH, PUT, POST, DELETE, OPTIONS"
  );
  next();
});

// Парсинг json - application/json
app.use(bodyParser.json());

// Парсинг запросов по типу: application/x-www-form-urlencoded
app.use(
  express.urlencoded({
    extended: true
  })
);

// Логирование запросов
app.use(morgan("common"));

// Запуск сервера на порте
const server = app
  .use("/", serveStatic(path.join(__dirname, "../dist")))
  .listen(port, () => {
    console.log(`server running on port ${port}`);
  });
// app.get(/.*/, function(req, res) {
//   res.sendFile(path.join(__dirname, "../dist/index.html"));
// });

// Создание соли для хеширования
const salt = bcrypt.genSaltSync(10);

const io = require("socket.io")(server);

// Создание подключения с БД
const sequelize = new Sequelize(DBCONFIG.DB, DBCONFIG.USER, DBCONFIG.PASSWORD, {
  dialect: "postgres",
  host: DBCONFIG.HOST
});

// МОДЕЛЬ: Users
const Users = sequelize.define("users", {
  user_id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  login: {
    type: Sequelize.STRING,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  admin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
});

// МОДЕЛЬ: Rooms
const Rooms = sequelize.define("rooms", {
  room_id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  owner_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  participants_id: {
    type: Sequelize.JSONB,
    allowNull: false
  },
  first_params: {
    type: Sequelize.JSONB,
    allowNull: false
  },
  completed: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  is_start: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
    allowNull: false
  }
});

// МОДЕЛЬ: UsersInRooms
const UsersInRooms = sequelize.define("users_in_rooms", {
  users_in_rooms_id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  room_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  current_month: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  gamer_room_params: {
    type: Sequelize.JSONB,
    allowNull: false
  },
  prev_room_params: {
    type: Sequelize.JSONB,
    // allowNull: false
  },
  effects: {
    type: Sequelize.JSONB,
    allowNull: true
  }
});
// Свзяь многие-ко-многим
Users.belongsToMany(Rooms, {
  through: UsersInRooms,
  foreignKey: 'user_id'
});
Rooms.belongsToMany(Users, {
  through: UsersInRooms,
  foreignKey: 'room_id'
});
// Связь один-ко-многим
Users.hasMany(Rooms, {
  foreignKey: 'owner_id'
});

// TODO:  Добавить заполнение таблицы Cards
// МОДЕЛЬ: Cards
const Cards = sequelize.define("cards", {
  card_id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  text: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  cost: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  duartion: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  data_change: {
    type: Sequelize.JSONB,
    allowNull: false
  }
});

// TODO:  Добавить заполнение таблицы Events
// МОДЕЛЬ: Events
const Events = sequelize.define("events", {
  event_id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  title: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  data_change: {
    type: Sequelize.JSONB,
    allowNull: false
  }
});

// TODO:  Добавить заполнение таблицы Updates
// МОДЕЛЬ: Updates
const Updates = sequelize.define("updates", {
  event_id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  }
});

// TODO:  Добавить заполнение таблицы DefaultRooms
// Модель: DefaultRooms
const DefaultRooms = sequelize.define("default_rooms", {
  default_room_id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  }
});

// Синхронизация таблиц с БД
sequelize
  // .sync({
  //   force: true
  // })
  // .sync({
  //   alter: true
  // })
  .sync()
  .then(result => {
    Users.create({
        login: "login",
        password: bcrypt.hashSync("password", salt),
        name: "Никита"
      })
      .then(res => {
        console.log(res.dataValues);
      })
      .catch(err => console.log(err));
    console.log("Подключено к БД");
  })
  .catch(err => console.log("Ошибка подключения к БД", err));

// Константы
const CARDS = require('./cards');
const EVENTS = require('./events');
const DEFAULTROOMS = require('./defaultrooms');

/** ************************** Модуль API *********************** */

// Авторизация
app.post("/api/login", (req, res) => {
  console.log("LOGIN: ", req.body);
  if (!req.body.login || !req.body.password) {
    res.status(400).send({
      status: 400,
      message: "Пустой запрос!"
    });
  } else {
    Users.findOne({
        where: {
          login: req.body.login
        }
      })
      .then(user => {
        if (!user) {
          res.status(404).send({
            status: 404,
            message: "Неправильный логин или пароль!"
          });
        } else {
          bcrypt.compare(req.body.password, user.password, function (
            err,
            result
          ) {
            if (err) {
              console.log("Ошибка расшифровки: ", err);
              res.status(500).send({
                status: 500,
                message: err
              });
            } else if (result) {
              console.log(result);
              const accessToken = jwt.sign({
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
            } else {
              res.status(404).send({
                status: 404,
                message: "Неправильный логин или пароль"
              });
            }
          });
        }
      })
      .catch(err => console.log(err));
  }
});

// Зарегистрироваться
app.post("/api/register", (req, res) => {
  console.log("REGISTER: ", req.body);
  if (!req.body.login || !req.body.password || !req.body.name) {
    res.status(400).send({
      status: 400,
      message: "Пустой запрос!"
    });
  } else {
    Users.findOne({
        where: {
          login: req.body.login
        }
      })
      .then(user => {
        if (user) {
          res.status(403).send({
            status: 403,
            message: "Пользователь с таким логином уже существет!"
          });
        } else {
          Users.create({
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
  console.log("Новая комната");
  console.log(req.body);
  console.log();
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
          let result = await Rooms.create({
            owner_id: decoded.id,
            participants_id: [decoded.id],
            first_params: req.body
          });
          await UsersInRooms.create({
            user_id: decoded.id,
            room_id: result.room_id,
            current_month: result.first_params.month,
            gamer_room_params: result.first_params,
            prev_room_params: result.first_params
          })
          result.dataValues.prev_room_params = result.first_params
          result.dataValues.gamer_room_params = result.first_params
          console.log(result);
          res.send(result);
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
        let findRoom = await Rooms.findOne({
          where: {
            room_id: req.params.id
          }
        });
        if (!findRoom) {
          res.status(404).send({
            status: 404,
            message: "Такой комнаты не существует!"
          });
        } else {
          if (findRoom.completed) {
            res.status(400).send({
              status: 400,
              message: "Игра в комнате была завершена!"
            });
          } else {
            let participantsArray = findRoom.participants_id;
            let isSet = participantsArray.findIndex(el => {
              return el === decoded.id
            });
            if (isSet === -1) {
              participantsArray.push(decoded.id);
              await Rooms.update({
                participants_id: participantsArray
              }, {
                where: {
                  room_id: req.params.id
                }
              });
              await UsersInRooms.create({
                user_id: decoded.id,
                room_id: req.params.id,
                current_month: findRoom.first_params.month,
                gamer_room_params: findRoom.first_params,
                prev_room_params: findRoom.first_params
              })
              res.send(findRoom);
            } else {
              let userInRoom = await UsersInRooms.findOne({
                where: {
                  user_id: decoded.id,
                  room_id: req.params.id,
                }
              })
              findRoom.first_params = userInRoom.gamer_room_params;
              res.send(findRoom)
            }
          }
        }
      }
    }
  );
});

// TODO: сделать JOIN у UsersInRooms и Rooms
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
        // decoded.id
        const Op = Sequelize.Op;
        let room = await Rooms.findOne({
          where: {
            participants_id: {
              [Op.contains]: decoded.id
            },
            completed: false
          },
          order: [
            ['updatedAt', 'DESC']
          ],
        });
        if (!room) {
          res.status(400).send({
            status: 400,
            message: "Нет активных игр!"
          });
        } else {
          let userInRoom = await UsersInRooms.findOne({
            where: {
              user_id: decoded.id,
              room_id: room.room_id
            },

          })
          if (!userInRoom) {
            res.status(400).send({
              status: 400,
              message: "Нет активных игр!",
              room
            });
          } else {
            res.send({
              room_id: room.room_id,
              owner_id: room.owner_id,
              is_start: room.is_start,
              first_params: room.first_params,
              prev_room_params: userInRoom.prev_room_params,
              gamer_room_params: userInRoom.gamer_room_params
            });
          }

        }

        // console.log("ПОИСК КОМНАТЫ С УЧАТСНИКОМ: ", findRoom.first_params);
      }
    }
  );
});
/** ************************************************************* */
let connections = [];
let connectedNames = [];
let roomsState = [];
let disconnectedUsers = [];
let leaveUsers = [];
let roomNumb = 10;



/** ********************************************* **/
/** ******Ниже описаны события Socket.io********* **/
/** ********************************************* **/

// io.use(socketioJwt.authorize({
//   secret: JWTCONFIG.SECRET,
//   handshake: true,
//   callback: 100
//   // auth_header_required: true
// }));

io.on("connection", socketioJwt.authorize({
    secret: JWTCONFIG.SECRET,
    timeout: 15000 // 15 секунд чтобы клиент отправил аутентификационное сообщение
  }))
  .on('authenticated', (socket) => {
    // Сокет авторизован, можем обрабатывать события от него
    connections.push(socket.id);
    console.log("Авторизованные подключения:", connections);

    // Прикрепление пользователя к комнате
    socket.on("subscribeRoom", roomId => {
      // let roomTitle = 'room' + roomId
      socket.join(roomId, () => {
        socket.roomId = roomId;
        console.log('Подключён к комнате ' + roomId);
      });
    });

    // При старте игры в комнате
    socket.on("startGame", async function (data) {
      console.log('SET START! ', data);
      try {
        let room = await Rooms.findOne({
          where: {
            room_id: data.room_id
          }
        });
        if (room) {
          await Rooms.update({
            is_start: false
          }, {
            where: {
              room_id: data.room_id
            }
          });
        }
        io.sockets.to(socket.roomId).emit("SET_GAME_START", false);
      } catch (error) {
        console.log(error);
      }
    });

    // При выполнении хода
    socket.on("doStep", async function (usedCards) {
      try {
        let gamer = await UsersInRooms.findOne({
          where: {
            user_id: socket.decoded_token.id,
            room_id: socket.roomId
          }
        })
        gamer = gamer.dataValues
        if (gamer.effects !== null) {
          gamer.effects.forEach(element => {
            console.log(element);
          });
        }
        // console.log('DO STEP', gamer);
      } catch (error) {
        console.log(error);
      }
      // TODO: Переделать под новую архитектуру
      //       for (const effect of gamer.effects) {
      //         let cardArrIndex = cardArr.findIndex(elem => elem === effect.id);
      //         if (cardArrIndex === -1) {
      //           let effectIndex = gamer.effects.findIndex(
      //             elem => elem.id === effect.id
      //           );
      //           gamer.effects.splice(effectIndex, 1);
      //           // !!! добавление в !!!
      //           // Добавление в массив использованных карточек
      //           if (typeof gamer.usedCards[effect.id] === "undefined") {
      //             gamer.usedCards[effect.id] = 1;
      //           } else {
      //             gamer.usedCards[effect.id]++;
      //           }
      //           io.sockets.to(gamer.id).emit("addMessage", {
      //             name: "ТЕСТ",
      //             text: `вот ${gamer.usedCards[effect.id]}`
      //           });
      //         }
      //       }
      //     }
      //     if (cardArr.length !== 0) {
      //       // ДЛЯ ВСЕХ ЭФФЕКТОВ ИГРОКА
      //       for (const effect of gamer.effects) {
      //         // Если в пришедшем массиве нет уже существующего эффекта
      //         let cardArrIndex = cardArr.findIndex(elem => elem === effect.id);
      //         if (cardArrIndex === -1) {
      //           let effectIndex = gamer.effects.findIndex(
      //             elem => elem.id === effect.id
      //           );
      //           gamer.effects.splice(effectIndex, 1);
      //         }
      //         if (effect.step === effect.duration) {
      //           let effectIndex = gamer.effects.findIndex(
      //             elem => elem.id === effect.id
      //           );
      //           gamer.effects.splice(effectIndex, 1);
      //           // console.log("Действие эффекта закончилось");
      //         } else {}
      //       }
      //       for (const cardId of cardArr) {
      //         // console.log("------------------------------------");
      //         // console.log(
      //         //   'Сделан шаг "' +
      //         //   cards.find(el => el.id === cardId).title +
      //         //   '" игроком ' +
      //         //   socket.name
      //         // );
      //         card = cards.find(el => el.id === cardId);
      //         // ИЗМЕНЕНИЕ ОТ КАРТОЧКИ
      //         // console.log("Массив карточек");
      //         gamer.data.money -= card.cost;

      //         // Если эффекта ещё нет (карточка выбрасывается первый раз)
      //         let effectIndex = gamer.effects.findIndex(elem => elem.id === cardId);
      //         if (cardId !== 3 && cardId !== 7) {
      //           if (effectIndex === -1) {
      //             // Занести свойства ещё не выброшенной серии
      //             for (const changes of card.dataChange) {
      //               let changeObj = {};
      //               for (var key in changes) {
      //                 changeObj[key] = changes[key];
      //               }
      //               gamer.changes.push(changeObj);
      //             }
      //             let effectObj = {
      //               id: cardId,
      //               name: card.title,
      //               step: 1,
      //               duration: card.duration
      //             };
      //             gamer.effects.push(effectObj);
      //           } else {
      //             // Если эффект существует в массиве
      //             gamer.effects[effectIndex].step++;
      //           }
      //         } else {
      //           if (effectIndex === -1) {
      //             // Занести свойства одноразовых карточек
      //             for (const changes of card.dataChange) {
      //               let changeObj = {};
      //               for (var k in changes) {
      //                 changeObj[k] = changes[k];
      //               }
      //               gamer.changes.push(changeObj);
      //             }
      //           }
      //         }

      //         // console.log("-------------------------------------");
      //       } // Конец цикла обработки пришедших карт
      //     }
      //     let messageArr = [];
      //     let clients =
      //       (gamer.data.organicCount * gamer.data.organicCoef +
      //         gamer.data.contextCount * gamer.data.contextCoef +
      //         gamer.data.socialsCount * gamer.data.socialsCoef +
      //         gamer.data.smmCount * gamer.data.smmCoef +
      //         gamer.data.straightCount * gamer.data.straightCoef) *
      //       gamer.data.conversion;
      //     gamer.data.clients = Math.ceil(clients);
      //     // console.log("Клиенты:");
      //     // console.log(clients);
      //     let averageCheck = gamer.data.averageCheck;

      //     let realCostAttract = gamer.data.realCostAttract;

      //     let commCircul = clients * averageCheck;
      //     gamer.data.commCircul = commCircul;
      //     let expenses = clients * realCostAttract;
      //     gamer.data.expenses = expenses;
      //     let result = commCircul - expenses;
      //     gamer.data.money += room.budgetPerMonth;
      //     // console.log('Обновлён параметр money со знаком + на ' + Math.ceil(result))
      //     // messageArr.push('Обновлён параметр money со знаком + на ' + Math.ceil(result))
      //     let resultPerClient = result / clients;
      //     gamer.data.moneyPerClient = Math.ceil(resultPerClient);

      //     let iter = 0;
      //     let indexEffArr;
      //     for (let index = 0; index < gamer.changes.length; index++) {
      //       let changing = gamer.changes[index];
      //       indexEffArr = gamer.effects.findIndex(elem => elem.id === changing.id);
      //       // console.log(
      //       //   "Для ID изменения " +
      //       //   changing.id +
      //       //   " индекс в м.эфф. равен " +
      //       //   indexEffArr
      //       // );
      //       if (
      //         indexEffArr === -1 &&
      //         changing.id !== 3 &&
      //         changing.id !== 7 &&
      //         changing.event === undefined
      //       ) {
      //         for (let index = 0; index < gamer.changes.length; index++) {
      //           if (gamer.changes[index].id === changing.id) {
      //             // console.log(
      //             //   "УДАЛЯЕТСЯ параметр " +
      //             //   changing.param +
      //             //   " со знаком " +
      //             //   changing.operation +
      //             //   " на " +
      //             //   changing.change +
      //             //   " (" +
      //             //   changing.from +
      //             //   ")"
      //             // );
      //             messageArr.push(
      //               "УДАЛЯЕТСЯ параметр " +
      //               changing.param +
      //               " со знаком " +
      //               changing.operation +
      //               " на " +
      //               changing.change +
      //               " (" +
      //               changing.from +
      //               ")"
      //             );
      //             // console.log("----!----");
      //             // console.log(gamer.changes[index]);
      //             // console.log("---- ----");
      //             gamer.changes.splice(index, 1);
      //             index--;
      //           }
      //         }
      //       }
      //       // ***********************************************************************
      //       if (changing.when === 1) {
      //         // console.log("*****************************************************");
      //         // console.log(changing);
      //         // console.log("*****************************************************");
      //         if (
      //           gamer.effects.findIndex(elem => elem.id === changing.id) !== -1 ||
      //           changing.id === 3 ||
      //           changing.id === 7 ||
      //           changing.event
      //         ) {
      //           if (
      //             gamer.usedCards[changing.id] < 1 ||
      //             typeof gamer.usedCards[changing.id] === "undefined"
      //           ) {
      //             switch (changing.operation) {
      //               case "+":
      //                 gamer.data[changing.param] += changing.change;
      //                 break;
      //               case "-":
      //                 gamer.data[changing.param] -= changing.change;
      //                 break;
      //               case "*":
      //                 gamer.data[changing.param] *= changing.change;
      //                 break;
      //               default:
      //                 // console.log(
      //                 //   "Что-то не так с операцией карточки по ID " + card.id
      //                 // );
      //                 messageArr.push(
      //                   "Что-то не так с операцией карточки по ID " + card.id
      //                 );
      //                 break;
      //             }
      //           } else {
      //             switch (changing.operation) {
      //               case "+":
      //                 gamer.data[changing.param] +=
      //                   changing.change / Math.pow(2, gamer.usedCards[changing.id]);
      //                 break;
      //               case "-":
      //                 gamer.data[changing.param] -=
      //                   changing.change / Math.pow(2, gamer.usedCards[changing.id]);
      //                 break;
      //               case "*":
      //                 gamer.data[changing.param] *=
      //                   changing.change / Math.pow(2, gamer.usedCards[changing.id]);
      //                 break;
      //               default:
      //                 // console.log(
      //                 //   "Что-то не так с операцией карточки по ID " + card.id
      //                 // );
      //                 messageArr.push(
      //                   "Что-то не так с операцией карточки по ID " + card.id
      //                 );
      //                 break;
      //             }
      //           }
      //           let analyticsString = "Обновлён  ";
      //           switch (changing.param) {
      //             case "organicCount":
      //               analyticsString += 'параметр "Органика"';
      //               break;
      //             case "contextCount":
      //               analyticsString += 'параметр "Реклама: контекст"';
      //               break;
      //             case "socialsCount":
      //               analyticsString += 'параметр "Реклама: соцсети"';
      //               break;
      //             case "smmCount":
      //               analyticsString += 'параметр "Соц. медиа"';
      //               break;
      //             case "straightCount":
      //               analyticsString += 'параметр "Прямой заход"';
      //               break;

      //             default:
      //               analyticsString += "параметр " + changing.param;
      //               break;
      //           }
      //           if (gamer.usedCards[changing.id] >= 1) {
      //             analyticsString +=
      //               " со знаком " +
      //               changing.operation +
      //               " на " +
      //               changing.change / Math.pow(2, gamer.usedCards[changing.id]) +
      //               " (" +
      //               changing.from +
      //               ")";
      //           } else {
      //             analyticsString +=
      //               " со знаком " +
      //               changing.operation +
      //               " на " +
      //               changing.change +
      //               " (" +
      //               changing.from +
      //               ")";
      //           }
      //           // console.log(analyticsString);
      //           messageArr.push(analyticsString);
      //           let indForDelete = gamer.changes.findIndex(elem => {
      //             return (
      //               elem.id === changing.id &&
      //               elem.change === changing.change &&
      //               elem.param === changing.param
      //             );
      //           });
      //           if (indForDelete !== -1) {
      //             // console.log('Удалилась позиция ' + indForDelete)
      //             // gamer.changes.splice(indForDelete, 1)
      //           }
      //         } else {
      //           // console.log('УДАЛЁН параметр ' + changing.param + ' со знаком ' + changing.operation + ' на ' + changing.change)
      //           // messageArr.push('УДАЛЁН параметр ' + changing.param + ' со знаком ' + changing.operation + ' на ' + changing.change)
      //           for (let index = 0; index < gamer.changes.length; index++) {
      //             if (gamer.changes[index].id === changing.id) {
      //               messageArr.push(
      //                 "УДАЛЁН параметр " +
      //                 changing.param +
      //                 " со знаком " +
      //                 changing.operation +
      //                 " на " +
      //                 changing.change
      //               );
      //               // console.log(
      //               //   "УДАЛЁН параметр " +
      //               //   changing.param +
      //               //   " со знаком " +
      //               //   changing.operation +
      //               //   " на " +
      //               //   changing.change
      //               // );
      //               gamer.changes.splice(index, 1);
      //             }
      //           }
      //         }
      //         gamer.changes.splice(iter, 1);
      //       } else {
      //         iter++;
      //       }
      //     }

      //     // console.log("ИЗМЕНЕНИЯ ИГРОКА");
      //     // console.log(gamer.changes);
      //     // Конец обработки пришедшего массива

      //     let gamers = roomsState.find(el => el.roomId === socket.roomId).gamers;
      //     // console.log("~~~~~gamers~~~~~~");
      //     // console.log(gamers);
      //     io.sockets.to(socket.roomId).emit("changeGamerStatus", socket.id);
      //     room.attackers--;
      //     // console.log("*");
      //     // console.log("*");
      //     // console.log("*");
      //     // console.log("АТАКУЮЩИЕ");
      //     // console.log(room.attackers);
      //     // console.log("СОХРАНЁННЫЕ АТАКУЮЩИЕ");
      //     // console.log(room.constAttackers);
      //     // console.log("Игроки без хода: " + room.attackers);
      //     if (messageArr.length !== 0) {
      //       for (let index = 0; index < messageArr.length; index++) {
      //         io.sockets.to(gamer.id).emit("addMessage", {
      //           name: "ОТДЕЛ АНАЛИТИКИ",
      //           text: messageArr[index]
      //         });
      //       }
      //       messageArr = [];
      //     }

      //     // Если все в комнате завершили ход
      //     if (room.attackers === 0) {
      //       room.roomState.month--;
      //       // console.log(room.roomState.month);
      //       // console.log("Обновление данных для ВСЕХ");
      //       setTimeout(() => {
      //         if (
      //           Math.floor(Math.random() * 10) % 2 === 0 &&
      //           room.roomState.month > 0
      //         ) {
      //           let randomEvent = events[Math.floor(Math.random() * events.length)];
      //           // console.log("Событие");
      //           // console.log(randomEvent);
      //           for (const eventChange of randomEvent.dataChange) {
      //             if (eventChange.when === 0) {
      //               for (const gamerPos of gamers) {
      //                 switch (eventChange.operation) {
      //                   case "+":
      //                     gamerPos.data[eventChange.param] += eventChange.change;
      //                     break;
      //                   case "-":
      //                     gamerPos.data[eventChange.param] -= eventChange.change;
      //                     break;
      //                   case "*":
      //                     gamerPos.data[eventChange.param] *= eventChange.change;
      //                     break;
      //                   default:
      //                     // console.log("Что-то не так с событием " + card.id);
      //                     break;
      //                 }
      //               }
      //               // console.log(
      //               //   "Событием изменен параметр " +
      //               //   eventChange.param +
      //               //   " со знаком " +
      //               //   eventChange.operation +
      //               //   " на " +
      //               //   eventChange.change
      //               // );
      //             } else {
      //               for (const oneGamer of gamers) {
      //                 oneGamer.changes.push(eventChange);
      //               }
      //             }
      //           }
      //           socket.emit("gameEvent");
      //           io.sockets.to(room.roomId).emit("gameEvent", randomEvent);
      //           io.sockets.to(room.roomId).emit("addMessage", {
      //             name: "СОБЫТИЕ!",
      //             text: `${randomEvent.description}`
      //           });
      //         }
      //         for (const gamerUser of gamers) {
      //           io.sockets.to(gamerUser.id).emit("setStartGame", gamerUser.data);
      //         }
      //         socket.emit("doNextStep");
      //         io.sockets.to(socket.roomId).emit("doNextStep");
      //         room.attackers = room.constAttackers;
      //       }, 1000);
      //     }
      //     // СЮДА

      //     for (let index = 0; index < gamer.changes.length; index++) {
      //       const changing = gamer.changes[index];
      //       changing.when--;
      //       if (changing.when < 1) {
      //         gamer.changes.splice(index, 1);
      //         index--;
      //       }
      //     }

      //     // console.log("Месяц:");
      //     // console.log(gamer.data.month);
      //     gamer.data.month--;
      //     if (room.roomState.month === 0) {
      //       for (const gamer of gamers) {
      //         io.sockets.to(gamer.id).emit("setStartGame", gamer.data);
      //       }
      //       let gamersRate = [];
      //       for (const gamer of gamers) {
      //         let position = {
      //           id: gamer.id,
      //           money: (Math.ceil(
      //                 gamer.data.organicCount *
      //                 gamer.data.organicCoef *
      //                 gamer.data.conversion
      //               ) +
      //               Math.ceil(
      //                 gamer.data.contextCount *
      //                 gamer.data.contextCoef *
      //                 gamer.data.conversion
      //               ) +
      //               Math.ceil(
      //                 gamer.data.socialsCount *
      //                 gamer.data.socialsCoef *
      //                 gamer.data.conversion
      //               ) +
      //               Math.ceil(
      //                 gamer.data.smmCount *
      //                 gamer.data.smmCoef *
      //                 gamer.data.conversion
      //               ) +
      //               Math.ceil(
      //                 gamer.data.straightCount *
      //                 gamer.data.straightCoef *
      //                 gamer.data.conversion
      //               )) *
      //             gamer.data.averageCheck
      //         };
      //         gamersRate.push(position);
      //       }
      //       gamersRate.sort((a, b) => {
      //         if (a.money > b.money) {
      //           return -1;
      //         } else if (a.money < b.money) {
      //           return 1;
      //         }
      //         return 0;
      //       });
      //       // console.log("Рейтинг игроков:");
      //       // console.log(gamersRate);
      //       let winners = {};
      //       for (let index = 1; index < 4; index++) {
      //         let a = gamersRate.shift();
      //         if (typeof a !== "undefined") {
      //           winners[index] = Object.assign(a);
      //           let person = connectedNames.find(el => el.id === a.id);
      //           if (typeof person !== "undefined") {
      //             winners[index].name = person.name;
      //           }
      //         } else winners[index] = a;
      //       }
      //       // console.log(winners);
      //       io.sockets.to(room.roomId).emit("addMessage", {
      //         name: "Admin",
      //         text: `Финито ля комедиа!`
      //       });

      //       io.sockets.to(room.roomId).emit("finish", winners);
      //     } else {}
      //     // console.log("---ДАННЫЕ ИГРОКА---");
      //     // console.log(gamer.data);
      //     // console.log("---ЭФФЕКТЫ ИГРОКА---");
      //     // console.log(gamer.effects);
      //     for (const gamer of gamers) {
      //       io.sockets.to(gamer.id).emit("setEffects", gamer.effects);
      //     }
      //   } else {
      //     // console.log("NEED USER DATA!");
      //     let room = roomsState.find(el => el.roomId === socket.roomId);
      //     // Поиск игрока
      //     let gamer = room.gamers.find(el => el.id === socket.id);
      //     // console.log("ROOM", room);
      //     // console.log("GAMERS", room.gamers);
      //     // console.log("SOCKETID", socket.id);
      //     io.sockets.to(socket.id).emit("needUserData");
      //   }

      io.sockets.to(socket.id).emit("addMessage", {
        name: "Admin",
        text: `Вы сделали ход!`
      });
    });

    // При потере подключения
    socket.on("disconnect", function () {
      connections.splice(connections.indexOf(socket.id), 1);
      console.log("Подключения:");
      console.log(connections);
    });
  });

// io.on("connection",
//   function (socket) {
//     console.log('hello!', socket.decoded_token);
//     connections.push(socket.id);
//     console.log("Подключения:", connections);

//     // Пересылка сообщения
//     // socket.on("newMessage", message => {
//     //   socket.broadcast.to(socket.roomId).emit("addMessage", {
//     //     name: socket.name,
//     //     text: `${message}`
//     //   });
//     // });

//     socket.on('authenticated', () => {
//       // this socket is authenticated, we are good to handle more events from it.
//       console.log(`hello! ${socket.decoded_token.name}`);
//       socket.emit('authenticated')
//     });



//     socket.on("disconnect", function () {
//       connections.splice(connections.indexOf(socket.id), 1);
//       console.log("Подключения:");
//       console.log(connections);
//     });
//   });










// console.log("Установка пользователю комнаты №", roomId);
// let oldNote = connectedNames.find(element => element.id === socket.id);
// if (oldNote !== undefined) {
//   oldNote.roomId = roomId;
//   if (leaveUsers[roomId] !== undefined) {
//     let leaveUserId = leaveUsers[roomId].findIndex(el => {
//       return el.id == socket.id;
//     });
//     if (leaveUserId !== -1) {
//       let sendObj = leaveUsers[roomId][leaveUserId];
//       if (sendObj.isAdmin) {
//         console.log("ADMIN!!!");
//         socket.emit("setOwner");
//       } else {
//         console.log("Не админ", sendObj.isAdmin);
//       }
//       console.log(socket.id);
//       console.log("Данные для отправки:", sendObj.data);
//       socket.emit("setStartGame", sendObj.data);

//       console.log("Имя пользователя: ", socket.name);
//       let gamerObj = {
//         id: socket.id,
//         name: socket.name,
//         data: sendObj.data,
//         changes: sendObj.changes,
//         effects: sendObj.effects,
//         usedCards: sendObj.usedCards
//       };
//       socket.emit("setEffects", sendObj.effects);
//       let room = roomsState.find(el => el.roomId === roomId);
//       if (room !== undefined) {
//         room.gamers.push(gamerObj);
//         console.log("КОМНАТА");
//         let gamerNames = [];
//         room.gamers.forEach(el => {
//           gamerNames.push({
//             name: el.name,
//             id: el.id,
//             isattacker: false
//           });
//         });
//         // gamerNames.push({
//         //   name: socket.name,
//         //   id: socket.id,
//         //   isattacker: false
//         // });
//         let gamerNamesObj = {
//           gamers: gamerNames
//         };
//         console.log(gamerNamesObj);
//         socket.emit("setGamers", gamerNamesObj);
//       } else {
//         console.log("ЧТО-ТО НЕ ТАК!");
//       }
//     }
//   }
// }
// });

// * ********************************************
// * ********************************************
// * ********************************************

// Ниже необработанные события

// * ********************************************
// * ********************************************
// * ********************************************

// socket.on("createRoom", () => {
//   let oldNote = connectedNames.find(element => element.id === socket.id);
//   if (oldNote !== undefined) {
//     oldNote.roomId = roomNumb;
//     oldNote.isAdmin = true;
//     // console.log("Подключенные имена:");
//     // console.log(connectedNames);
//     socket.roomId = roomNumb;
//     socket.join(roomNumb, () => {
//       // console.log(`Создана комната #${roomNumb}`);
//       socket.emit("setRoomNumber", roomNumb);
//       roomNumb++;
//     });
//   }
// });

// socket.on("startGame", obj => {
//   // console.log("Приём");
//   // console.log(Object.assign(obj));
//   let roomState = {};
//   roomState.roomId = socket.roomId;
//   roomState.roomState = obj;
//   let gamerNames = [];
//   if (io.sockets.adapter.rooms[socket.roomId] !== undefined) {
//     // console.log("Комнаты:");
//     // console.log(io.sockets.adapter.rooms[socket.roomId].sockets);
//     let gamerIds = Object.keys(
//       io.sockets.adapter.rooms[socket.roomId].sockets
//     );
//     let gamers = [];
//     let attackers = 0;
//     for (const id of gamerIds) {
//       let findName;
//       let nameFromConnected = connectedNames.find(el => el.id === id);
//       if (nameFromConnected !== undefined) {
//         findName = nameFromConnected.name;
//         gamerNames.push({
//           name: findName,
//           id,
//           isattacker: false
//         });
//       }

//       attackers++;
//       // console.log(id + "---");

//       let gamerObj = {
//         id,
//         name: findName,
//         data: Object.assign({}, obj),
//         changes: [],
//         effects: [],
//         usedCards: []
//       };
//       // console.log("!!!!");
//       // console.log(gamerObj.data);
//       gamers.push(gamerObj);
//     }
//     roomState.constAttackers = attackers;
//     roomState.attackers = attackers;
//     roomState.gamers = gamers;
//     roomState.budgetPerMonth = obj.money;
//     roomsState.push(roomState);
//   }

//   // console.log("Стейт комнат: ");
//   // console.log(roomsState);
//   let gamerNamesObj = {
//     gamers: gamerNames
//   };
//   io.sockets.to(socket.roomId).emit("setGamers", gamerNamesObj);
//   socket.to(socket.roomId).emit("setStartGame", obj);
// });

// // socket.on('typing', function () {
// //   socket.to(socket.roomId).broadcast.emit('addMessage');
// // });

// socket.on("kickUser", function (roomId, user) {
//   // console.log("Удаляем пользователя с ID ", roomId, "---", user);
//   let room = roomsState.find(el => el.roomId === roomId);
//   if (room) {
//     let userIndex = room.gamers.findIndex(el => el.id == user.id);
//     room.gamers.splice(userIndex, 1);
//     io.sockets.to(user.id).emit("kickUser");
//     let gamerNames = [];
//     room.gamers.forEach(el => {
//       gamerNames.push({
//         name: el.name,
//         id: el.id,
//         isattacker: false
//       });
//     });
//     let gamerNamesObj = {
//       gamers: gamerNames
//     };
//     io.sockets.to(socket.roomId).emit("setGamers", gamerNamesObj);
//     io.sockets.to(socket.roomId).emit("addMessage", {
//       name: "Admin",
//       text: `Из комнаты был удалён игрок с именем ${user.name}`
//     });
//     // console.log(room);
//     // console.log(userIndex);
//   }
// });

// socket.on("refreshSocketID", function (oldSocketId, roomId) {
//   // console.log("Refresh ID");
//   // console.log("Socket room ID", socket.roomId);
//   let room = roomsState.find(el => el.roomId === roomId);
//   // console.log("Room", room);
//   // let gamer;
//   if (room !== undefined) {
//     let refreshUser = disconnectedUsers.find(el => el.id === oldSocketId);
//     if (refreshUser) {
//       refreshUser.id = socket.id;
//       // console.log("REFRESH USER", refreshUser);
//       room.gamers.push(refreshUser);
//       let gamerNames = [];
//       room.gamers.forEach(el => {
//         gamerNames.push({
//           name: el.name,
//           id: el.id,
//           isattacker: false
//         });
//       });
//       let gamerNamesObj = {
//         gamers: gamerNames
//       };
//       io.sockets.to(socket.roomId).emit("setGamers", gamerNamesObj);
//     }
//   } else {
//     // io.sockets.to(socket.id).emit("resetData");
//     io.sockets.to(socket.id).emit("addMessage", {
//       name: "Admin",
//       text: `Хочет перезагрузку`
//     });
//   }
// });


// // если room.gamers!==undefined
// // Поиск комнаты
// let room = roomsState.find(el => el.roomId === socket.roomId);
// // console.log("ИГРОКИ КОМНАТЫ", room.gamers);
// // Поиск игрока
// let gamer;
// if (room !== undefined) {
//   // !!!!!!!!!!!!!!!!!Спорно!!!!!!!!!!!!!!
//   gamer = room.gamers.find(el => el.id === socket.id);
// }
//     let card;
//     io.sockets.to(gamer.id).emit("addMessage", {
//       name: "Admin",
//       text: `Вы сделали ход!`
//     });

// socket.on("doStep", function (cardArr) {

//   if (gamer !== undefined) {
//     // Начало обработки пришедшего массива с ID карточек
//     if (typeof gamer !== "undefined") {
//       for (const effect of gamer.effects) {
//         let cardArrIndex = cardArr.findIndex(elem => elem === effect.id);
//         if (cardArrIndex === -1) {
//           let effectIndex = gamer.effects.findIndex(
//             elem => elem.id === effect.id
//           );
//           gamer.effects.splice(effectIndex, 1);
//           // !!! добавление в !!!
//           // Добавление в массив использованных карточек
//           if (typeof gamer.usedCards[effect.id] === "undefined") {
//             gamer.usedCards[effect.id] = 1;
//           } else {
//             gamer.usedCards[effect.id]++;
//           }
//           io.sockets.to(gamer.id).emit("addMessage", {
//             name: "ТЕСТ",
//             text: `вот ${gamer.usedCards[effect.id]}`
//           });
//         }
//       }
//     }
//     if (cardArr.length !== 0) {
//       // ДЛЯ ВСЕХ ЭФФЕКТОВ ИГРОКА
//       for (const effect of gamer.effects) {
//         // Если в пришедшем массиве нет уже существующего эффекта
//         let cardArrIndex = cardArr.findIndex(elem => elem === effect.id);
//         if (cardArrIndex === -1) {
//           let effectIndex = gamer.effects.findIndex(
//             elem => elem.id === effect.id
//           );
//           gamer.effects.splice(effectIndex, 1);
//         }
//         if (effect.step === effect.duration) {
//           let effectIndex = gamer.effects.findIndex(
//             elem => elem.id === effect.id
//           );
//           gamer.effects.splice(effectIndex, 1);
//           // console.log("Действие эффекта закончилось");
//         } else {}
//       }
//       for (const cardId of cardArr) {
//         // console.log("------------------------------------");
//         // console.log(
//         //   'Сделан шаг "' +
//         //   cards.find(el => el.id === cardId).title +
//         //   '" игроком ' +
//         //   socket.name
//         // );
//         card = cards.find(el => el.id === cardId);
//         // ИЗМЕНЕНИЕ ОТ КАРТОЧКИ
//         // console.log("Массив карточек");
//         gamer.data.money -= card.cost;

//         // Если эффекта ещё нет (карточка выбрасывается первый раз)
//         let effectIndex = gamer.effects.findIndex(elem => elem.id === cardId);
//         if (cardId !== 3 && cardId !== 7) {
//           if (effectIndex === -1) {
//             // Занести свойства ещё не выброшенной серии
//             for (const changes of card.dataChange) {
//               let changeObj = {};
//               for (var key in changes) {
//                 changeObj[key] = changes[key];
//               }
//               gamer.changes.push(changeObj);
//             }
//             let effectObj = {
//               id: cardId,
//               name: card.title,
//               step: 1,
//               duration: card.duration
//             };
//             gamer.effects.push(effectObj);
//           } else {
//             // Если эффект существует в массиве
//             gamer.effects[effectIndex].step++;
//           }
//         } else {
//           if (effectIndex === -1) {
//             // Занести свойства одноразовых карточек
//             for (const changes of card.dataChange) {
//               let changeObj = {};
//               for (var k in changes) {
//                 changeObj[k] = changes[k];
//               }
//               gamer.changes.push(changeObj);
//             }
//           }
//         }

//         // console.log("-------------------------------------");
//       } // Конец цикла обработки пришедших карт
//     }
//     let messageArr = [];
//     let clients =
//       (gamer.data.organicCount * gamer.data.organicCoef +
//         gamer.data.contextCount * gamer.data.contextCoef +
//         gamer.data.socialsCount * gamer.data.socialsCoef +
//         gamer.data.smmCount * gamer.data.smmCoef +
//         gamer.data.straightCount * gamer.data.straightCoef) *
//       gamer.data.conversion;
//     gamer.data.clients = Math.ceil(clients);
//     // console.log("Клиенты:");
//     // console.log(clients);
//     let averageCheck = gamer.data.averageCheck;

//     let realCostAttract = gamer.data.realCostAttract;

//     let commCircul = clients * averageCheck;
//     gamer.data.commCircul = commCircul;
//     let expenses = clients * realCostAttract;
//     gamer.data.expenses = expenses;
//     let result = commCircul - expenses;
//     gamer.data.money += room.budgetPerMonth;
//     // console.log('Обновлён параметр money со знаком + на ' + Math.ceil(result))
//     // messageArr.push('Обновлён параметр money со знаком + на ' + Math.ceil(result))
//     let resultPerClient = result / clients;
//     gamer.data.moneyPerClient = Math.ceil(resultPerClient);

//     let iter = 0;
//     let indexEffArr;
//     for (let index = 0; index < gamer.changes.length; index++) {
//       let changing = gamer.changes[index];
//       indexEffArr = gamer.effects.findIndex(elem => elem.id === changing.id);
//       // console.log(
//       //   "Для ID изменения " +
//       //   changing.id +
//       //   " индекс в м.эфф. равен " +
//       //   indexEffArr
//       // );
//       if (
//         indexEffArr === -1 &&
//         changing.id !== 3 &&
//         changing.id !== 7 &&
//         changing.event === undefined
//       ) {
//         for (let index = 0; index < gamer.changes.length; index++) {
//           if (gamer.changes[index].id === changing.id) {
//             // console.log(
//             //   "УДАЛЯЕТСЯ параметр " +
//             //   changing.param +
//             //   " со знаком " +
//             //   changing.operation +
//             //   " на " +
//             //   changing.change +
//             //   " (" +
//             //   changing.from +
//             //   ")"
//             // );
//             messageArr.push(
//               "УДАЛЯЕТСЯ параметр " +
//               changing.param +
//               " со знаком " +
//               changing.operation +
//               " на " +
//               changing.change +
//               " (" +
//               changing.from +
//               ")"
//             );
//             // console.log("----!----");
//             // console.log(gamer.changes[index]);
//             // console.log("---- ----");
//             gamer.changes.splice(index, 1);
//             index--;
//           }
//         }
//       }
//       // ***********************************************************************
//       if (changing.when === 1) {
//         // console.log("*****************************************************");
//         // console.log(changing);
//         // console.log("*****************************************************");
//         if (
//           gamer.effects.findIndex(elem => elem.id === changing.id) !== -1 ||
//           changing.id === 3 ||
//           changing.id === 7 ||
//           changing.event
//         ) {
//           if (
//             gamer.usedCards[changing.id] < 1 ||
//             typeof gamer.usedCards[changing.id] === "undefined"
//           ) {
//             switch (changing.operation) {
//               case "+":
//                 gamer.data[changing.param] += changing.change;
//                 break;
//               case "-":
//                 gamer.data[changing.param] -= changing.change;
//                 break;
//               case "*":
//                 gamer.data[changing.param] *= changing.change;
//                 break;
//               default:
//                 // console.log(
//                 //   "Что-то не так с операцией карточки по ID " + card.id
//                 // );
//                 messageArr.push(
//                   "Что-то не так с операцией карточки по ID " + card.id
//                 );
//                 break;
//             }
//           } else {
//             switch (changing.operation) {
//               case "+":
//                 gamer.data[changing.param] +=
//                   changing.change / Math.pow(2, gamer.usedCards[changing.id]);
//                 break;
//               case "-":
//                 gamer.data[changing.param] -=
//                   changing.change / Math.pow(2, gamer.usedCards[changing.id]);
//                 break;
//               case "*":
//                 gamer.data[changing.param] *=
//                   changing.change / Math.pow(2, gamer.usedCards[changing.id]);
//                 break;
//               default:
//                 // console.log(
//                 //   "Что-то не так с операцией карточки по ID " + card.id
//                 // );
//                 messageArr.push(
//                   "Что-то не так с операцией карточки по ID " + card.id
//                 );
//                 break;
//             }
//           }
//           let analyticsString = "Обновлён  ";
//           switch (changing.param) {
//             case "organicCount":
//               analyticsString += 'параметр "Органика"';
//               break;
//             case "contextCount":
//               analyticsString += 'параметр "Реклама: контекст"';
//               break;
//             case "socialsCount":
//               analyticsString += 'параметр "Реклама: соцсети"';
//               break;
//             case "smmCount":
//               analyticsString += 'параметр "Соц. медиа"';
//               break;
//             case "straightCount":
//               analyticsString += 'параметр "Прямой заход"';
//               break;

//             default:
//               analyticsString += "параметр " + changing.param;
//               break;
//           }
//           if (gamer.usedCards[changing.id] >= 1) {
//             analyticsString +=
//               " со знаком " +
//               changing.operation +
//               " на " +
//               changing.change / Math.pow(2, gamer.usedCards[changing.id]) +
//               " (" +
//               changing.from +
//               ")";
//           } else {
//             analyticsString +=
//               " со знаком " +
//               changing.operation +
//               " на " +
//               changing.change +
//               " (" +
//               changing.from +
//               ")";
//           }
//           // console.log(analyticsString);
//           messageArr.push(analyticsString);
//           let indForDelete = gamer.changes.findIndex(elem => {
//             return (
//               elem.id === changing.id &&
//               elem.change === changing.change &&
//               elem.param === changing.param
//             );
//           });
//           if (indForDelete !== -1) {
//             // console.log('Удалилась позиция ' + indForDelete)
//             // gamer.changes.splice(indForDelete, 1)
//           }
//         } else {
//           // console.log('УДАЛЁН параметр ' + changing.param + ' со знаком ' + changing.operation + ' на ' + changing.change)
//           // messageArr.push('УДАЛЁН параметр ' + changing.param + ' со знаком ' + changing.operation + ' на ' + changing.change)
//           for (let index = 0; index < gamer.changes.length; index++) {
//             if (gamer.changes[index].id === changing.id) {
//               messageArr.push(
//                 "УДАЛЁН параметр " +
//                 changing.param +
//                 " со знаком " +
//                 changing.operation +
//                 " на " +
//                 changing.change
//               );
//               // console.log(
//               //   "УДАЛЁН параметр " +
//               //   changing.param +
//               //   " со знаком " +
//               //   changing.operation +
//               //   " на " +
//               //   changing.change
//               // );
//               gamer.changes.splice(index, 1);
//             }
//           }
//         }
//         gamer.changes.splice(iter, 1);
//       } else {
//         iter++;
//       }
//     }

//     // console.log("ИЗМЕНЕНИЯ ИГРОКА");
//     // console.log(gamer.changes);
//     // Конец обработки пришедшего массива

//     let gamers = roomsState.find(el => el.roomId === socket.roomId).gamers;
//     // console.log("~~~~~gamers~~~~~~");
//     // console.log(gamers);
//     io.sockets.to(socket.roomId).emit("changeGamerStatus", socket.id);
//     room.attackers--;
//     // console.log("*");
//     // console.log("*");
//     // console.log("*");
//     // console.log("АТАКУЮЩИЕ");
//     // console.log(room.attackers);
//     // console.log("СОХРАНЁННЫЕ АТАКУЮЩИЕ");
//     // console.log(room.constAttackers);
//     // console.log("Игроки без хода: " + room.attackers);
//     if (messageArr.length !== 0) {
//       for (let index = 0; index < messageArr.length; index++) {
//         io.sockets.to(gamer.id).emit("addMessage", {
//           name: "ОТДЕЛ АНАЛИТИКИ",
//           text: messageArr[index]
//         });
//       }
//       messageArr = [];
//     }

//     // Если все в комнате завершили ход
//     if (room.attackers === 0) {
//       room.roomState.month--;
//       // console.log(room.roomState.month);
//       // console.log("Обновление данных для ВСЕХ");
//       setTimeout(() => {
//         if (
//           Math.floor(Math.random() * 10) % 2 === 0 &&
//           room.roomState.month > 0
//         ) {
//           let randomEvent = events[Math.floor(Math.random() * events.length)];
//           // console.log("Событие");
//           // console.log(randomEvent);
//           for (const eventChange of randomEvent.dataChange) {
//             if (eventChange.when === 0) {
//               for (const gamerPos of gamers) {
//                 switch (eventChange.operation) {
//                   case "+":
//                     gamerPos.data[eventChange.param] += eventChange.change;
//                     break;
//                   case "-":
//                     gamerPos.data[eventChange.param] -= eventChange.change;
//                     break;
//                   case "*":
//                     gamerPos.data[eventChange.param] *= eventChange.change;
//                     break;
//                   default:
//                     // console.log("Что-то не так с событием " + card.id);
//                     break;
//                 }
//               }
//               // console.log(
//               //   "Событием изменен параметр " +
//               //   eventChange.param +
//               //   " со знаком " +
//               //   eventChange.operation +
//               //   " на " +
//               //   eventChange.change
//               // );
//             } else {
//               for (const oneGamer of gamers) {
//                 oneGamer.changes.push(eventChange);
//               }
//             }
//           }
//           socket.emit("gameEvent");
//           io.sockets.to(room.roomId).emit("gameEvent", randomEvent);
//           io.sockets.to(room.roomId).emit("addMessage", {
//             name: "СОБЫТИЕ!",
//             text: `${randomEvent.description}`
//           });
//         }
//         for (const gamerUser of gamers) {
//           io.sockets.to(gamerUser.id).emit("setStartGame", gamerUser.data);
//         }
//         socket.emit("doNextStep");
//         io.sockets.to(socket.roomId).emit("doNextStep");
//         room.attackers = room.constAttackers;
//       }, 1000);
//     }
//     // СЮДА

//     for (let index = 0; index < gamer.changes.length; index++) {
//       const changing = gamer.changes[index];
//       changing.when--;
//       if (changing.when < 1) {
//         gamer.changes.splice(index, 1);
//         index--;
//       }
//     }

//     // console.log("Месяц:");
//     // console.log(gamer.data.month);
//     gamer.data.month--;
//     if (room.roomState.month === 0) {
//       for (const gamer of gamers) {
//         io.sockets.to(gamer.id).emit("setStartGame", gamer.data);
//       }
//       let gamersRate = [];
//       for (const gamer of gamers) {
//         let position = {
//           id: gamer.id,
//           money: (Math.ceil(
//                 gamer.data.organicCount *
//                 gamer.data.organicCoef *
//                 gamer.data.conversion
//               ) +
//               Math.ceil(
//                 gamer.data.contextCount *
//                 gamer.data.contextCoef *
//                 gamer.data.conversion
//               ) +
//               Math.ceil(
//                 gamer.data.socialsCount *
//                 gamer.data.socialsCoef *
//                 gamer.data.conversion
//               ) +
//               Math.ceil(
//                 gamer.data.smmCount *
//                 gamer.data.smmCoef *
//                 gamer.data.conversion
//               ) +
//               Math.ceil(
//                 gamer.data.straightCount *
//                 gamer.data.straightCoef *
//                 gamer.data.conversion
//               )) *
//             gamer.data.averageCheck
//         };
//         gamersRate.push(position);
//       }
//       gamersRate.sort((a, b) => {
//         if (a.money > b.money) {
//           return -1;
//         } else if (a.money < b.money) {
//           return 1;
//         }
//         return 0;
//       });
//       // console.log("Рейтинг игроков:");
//       // console.log(gamersRate);
//       let winners = {};
//       for (let index = 1; index < 4; index++) {
//         let a = gamersRate.shift();
//         if (typeof a !== "undefined") {
//           winners[index] = Object.assign(a);
//           let person = connectedNames.find(el => el.id === a.id);
//           if (typeof person !== "undefined") {
//             winners[index].name = person.name;
//           }
//         } else winners[index] = a;
//       }
//       // console.log(winners);
//       io.sockets.to(room.roomId).emit("addMessage", {
//         name: "Admin",
//         text: `Финито ля комедиа!`
//       });

//       io.sockets.to(room.roomId).emit("finish", winners);
//     } else {}
//     // console.log("---ДАННЫЕ ИГРОКА---");
//     // console.log(gamer.data);
//     // console.log("---ЭФФЕКТЫ ИГРОКА---");
//     // console.log(gamer.effects);
//     for (const gamer of gamers) {
//       io.sockets.to(gamer.id).emit("setEffects", gamer.effects);
//     }
//   } else {
//     // console.log("NEED USER DATA!");
//     let room = roomsState.find(el => el.roomId === socket.roomId);
//     // Поиск игрока
//     let gamer = room.gamers.find(el => el.id === socket.id);
//     // console.log("ROOM", room);
//     // console.log("GAMERS", room.gamers);
//     // console.log("SOCKETID", socket.id);
//     io.sockets.to(socket.id).emit("needUserData");
//   }
// });

// socket.on("leaveRoom", function () {
//   // console.log(`${socket.name} уходит с комнаты!`);
//   let oldNote = connectedNames.find(element => element.id === socket.id);
//   if (oldNote !== undefined) {
//     oldNote.roomId = -1;
//     socket.emit("setRoomNumber", -1);
//   }
//   for (let index = 0; index < roomsState.length; index++) {
//     let gamerThereIndex = roomsState[index].gamers.findIndex(
//       el => el.id === socket.id
//     );
//     if (gamerThereIndex !== -1) {
//       // console.log(
//       //   "Уходит, объект: ",
//       //   roomsState[index].gamers[gamerThereIndex]
//       // );
//       roomsState[index].gamers[gamerThereIndex].isAdmin = oldNote.isAdmin;
//       if (typeof leaveUsers[socket.roomId] !== "array") {
//         leaveUsers[socket.roomId] = [];
//         leaveUsers[socket.roomId].push(
//           roomsState[index].gamers[gamerThereIndex]
//         );
//         // console.log(leaveUsers);
//       } else {
//         leaveUsers[socket.roomId].push(
//           roomsState[index].gamers[gamerThereIndex]
//         );
//       }
//       roomsState[index].gamers.splice(gamerThereIndex, 1);
//     }
//   }
//   // console.log("Подключенные имена:");
//   // console.log(connectedNames);
// });

// socket.on("checkRoom", function (id) {
//   // console.log(`Поиск комнаты с номером ${id}`);
//   // console.log(connectedNames);
//   let check = false;
//   setTimeout(() => {
//     for (const gamer of connectedNames) {
//       // console.log("gamer:");
//       // console.log(gamer);
//       // console.log(gamer.roomId);
//       if (+gamer.roomId === +id) {
//         check = true;
//         // console.log(`Комната найдена`);
//         break;
//       }
//     }
//     if (!check) {
//       // console.log(`Комната не найдена`);
//       socket.emit("roomNotFound");
//     }
//   }, 200);
// });
