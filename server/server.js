"use strict";
const express = require("express");
const serveStatic = require("serve-static");
const bodyParser = require("body-parser");
const Sequelize = require("sequelize");
const path = require("path");
const morgan = require("morgan");
const compression = require("compression");
const jwt = require("jsonwebtoken");
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
const { trySetCards, trySetEvents } = require("./global_functions/setters");

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

// const ONEWAYCARDS = require("./onewaycards.js");

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
    trySetCards(db);
    trySetEvents(db);
  });

// Создание сервера Socket.io
const io = require("socket.io")(server);

// Подключение роутера API
app.use("/api", require("./api_routes/router")(io));

/** ************************************************************* */

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
  require("./socket_events/do_step")(socket, io, db);

  // При потере подключения
  require("./socket_events/disconnect")(socket, io, db);
});
