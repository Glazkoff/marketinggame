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
const DBCONFIG = require("./db.config");
const JWTCONFIG = require("./secret.config");
const chalk = require("chalk");
const helmet = require("helmet");
const history = require("connect-history-api-fallback");

const cors = require("cors");
const {
  logSocketState,
  logSocketOutEvent,
  logSocketInEvent
} = require("./global_functions/logs");

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
app.use(morgan("common"));

// app.get(/.*/, function(req, res) {
//   res.sendFile(path.join(__dirname, "../dist/index.html"));
// });

// Создание соли для хеширования
const salt = bcrypt.genSaltSync(10);

// Создание подключения с БД
const sequelize = new Sequelize(DBCONFIG.DB, DBCONFIG.USER, DBCONFIG.PASSWORD, {
  dialect: "postgres",
  host: DBCONFIG.HOST,
  logging: false // TODO: УБРАТЬ
});

// МОДЕЛЬ: Cards
const Cards = sequelize.define("cards", {
  card_id: {
    type: Sequelize.INTEGER,
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
  coefs: {
    type: Sequelize.JSONB,
    defaultValue: []
  },
  templateText: {
    type: Sequelize.TEXT
  },
  cost: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  duration: {
    type: Sequelize.INTEGER
  },
  data_change: {
    type: Sequelize.JSONB,
    allowNull: false
  },
  oneOff: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
});

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
// const Updates = sequelize.define("updates", {
//   event_id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//     allowNull: false
//   },
//   content: {
//     type: Sequelize.TEXT,
//     allowNull: false
//   }
// });

// Синхронизация таблиц с БД
sequelize
  // .sync({
  //   force: true
  // })
  .sync({
    alter: true
  })
  // .sync()
  .then(result => {
    // db.User.create({
    //   login: "login",
    //   password: bcrypt.hashSync("password", salt),
    //   name: "Никита"
    // })
    //   .then(res => {
    //     console.log(res.dataValues);
    //   })
    //   .catch(err => console.log(err));
    trySetCards();
    trySetEvents();
    console.log("Подключено к БД");
  })
  .catch(err => console.log("Ошибка подключения к БД", err));

// Константы
const CARDS = require("./cards");
const EVENTS = require("./events");
const DEFAULTROOMS = require("./defaultrooms");

// const ONEWAYCARDS = require("./onewaycards.js");

async function trySetCards() {
  // await Cards.destroy({ where: {} });
  for (let card of CARDS) {
    let findCard = await Cards.findOne({
      where: {
        card_id: card.id
      }
    });
    if (JSON.stringify(findCard) === "null") {
      Cards.create({
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
    let findEvent = await Events.findOne({
      where: {
        event_id: event.id
      }
    });
    if (JSON.stringify(findEvent) === "null") {
      Events.create({
        event_id: event.id,
        title: event.title,
        description: event.description,
        data_change: event.data_change
      });
    }
  }
}

async function getOneOffCardsId() {
  let result;
  try {
    result = await Cards.findAll({
      attributes: ["card_id"],
      where: {
        oneOff: true
      }
    });
  } catch (e) {
    console.log(e);
  }
  return result;
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

// Список всех отзывов
app.get("/api/reviews", async (req, res) => {
  try {
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
    // }
    //   }
    // );
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: 500,
      message: "Ошибка сервера!"
    });
  }
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

// Удалить отзыв
app.delete("/api/reviews/:id", async (req, res) => {
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
          // console.log(result);
          console.log("app.delete 493");
          res.sendStatus(200);
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: 500,
      message: "Ошибка сервера!"
    });
  }
});

// Добавить отзыв
app.post("/api/reviews", async (req, res) => {
  // console.log(chalk.bgRed(JSON.stringify(req.body)));
  console.log("app.post 510");
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
          console.log("JJJJ", decoded);
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
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: 500,
      message: "Ошибка сервера!"
    });
  }
});

app.get("/api/reviews", async (req, res) => {
  try {
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
    // }
    //   }
    // );
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: 500,
      message: "Ошибка сервера!"
    });
  }
});

app.get("/api/reviewslist", async (req, res) => {
  try {
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
    let result = await db.Review.findAll({
      order: [["updatedAt", "DESC"]],
      include: [
        {
          model: db.User,
          as: "user"
        }
      ]
    });
    res.send({
      reviews: result
    });
    // }
    //   }
    // );
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: 500,
      message: "Ошибка сервера!"
    });
  }
});

// Добавить отзыв
app.get("/api/reviews/:id", async (req, res) => {
  try {
    let result = await db.Review.findOne({
      where: {
        review_id: req.params.id
      }
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

// Изменение описания события через админпанель
app.put("/api/admin/events/description/:id", async (req, res) => {
  // console.log(chalk.bgRed(JSON.stringify(req.body)));
  console.log("app put 630");
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
          // console.log(req.body);
          console.log("app.put 643");
          let result = await Events.update(
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
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: 500,
      message: "Ошибка сервера!"
    });
  }
});

// Добавление, редактирование или удаление параметра события
app.post("/api/admin/events/:id", async (req, res) => {
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
          // console.log(chalk.bgRed(JSON.stringify(req.body)));
          console.log("app post 682");
          let newParam = req.body;
          let findEvent = await Events.findOne({
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
                // console.log(chalk.bgYellow(JSON.stringify(findEvent)));
                console.log("app post 698");
                findEvent.data_change[findEventParamIndex] = newParam;
              }
            } else {
              newParam.from = `${findEvent.title} ${newParam.when}`;
              findEvent.data_change.push(newParam);
            }
            let a = await Events.update(
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
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: 500,
      message: "Ошибка сервера!"
    });
  }
});

// Получение данных обо всех случайных событиях для администратора
app.get("/api/admin/events", async (req, res) => {
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
          let result = await Events.findAll({
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
  } catch (e) {
    console.log(e);
    res.status(500).send({
      status: 500,
      message: "Ошибка сервера!"
    });
  }
});

// Изменение описания карточки через админпанель
app.put("/api/admin/cards/description/:id", async (req, res) => {
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
          // console.log(req.body);
          console.log("778 app put");
          let result = await Cards.update(
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
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: 500,
      message: "Ошибка сервера!"
    });
  }
});

// Получение списка одноразовых карточек
app.get("/api/cards/oneoff", async (req, res) => {
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
        let result = await getOneOffCardsId();
        res.send(result);
      }
    }
  );
});

// Обновление статуса карточки: одно- или многоразовая
app.post("/api/admin/cards/oneoff/:id", async (req, res) => {
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
        let result = await Cards.update(
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
});

// Добавление, редактирование или удаление параметра карточки
app.post("/api/admin/cards/:id", async (req, res) => {
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
          // console.log(chalk.bgRed(JSON.stringify(req.body)));
          console.log("app post 866");
          let newParam = req.body;
          let findCard = await Cards.findOne({
            where: {
              card_id: req.params.id
            }
          });
          if (JSON.stringify(findCard) !== "{}") {
            let findCardParamIndex = findCard.data_change.findIndex(el => {
              return el.param === req.body.param && el.when === req.body.when;
            });
            if (findCardParamIndex !== -1) {
              if (req.body.toDelete) {
                findCard.data_change.splice(findCardParamIndex, 1);
              } else {
                // console.log(chalk.bgYellow(JSON.stringify(findCard)));
                console.log("app post 882");
                findCard.data_change[findCardParamIndex] = newParam;
              }
            } else {
              newParam.from = `${findCard.title} ${newParam.when}`;
              findCard.data_change.push(newParam);
            }
            let a = await Cards.update(
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
            res.status(500).send({
              message: "Error",
              status: 500
            });
          }
        }
      }
    );
  } catch (e) {
    console.log(e);
    res.status(500).send({
      status: 500,
      message: "Ошибка сервера!"
    });
  }
});

// Получение данных обо всех карточек для администратора
app.get("/api/admin/cards", async (req, res) => {
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
          let result = await Cards.findAll({
            attributes: [
              ["card_id", "id"],
              "title",
              "text",
              "coefs",
              "templateText",
              "cost",
              "duration",
              "oneOff",
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
  } catch (e) {
    console.log(e);
    res.status(500).send({
      status: 500,
      message: "Ошибка сервера!"
    });
  }
});

// Удаление записи о пользователе
app.delete("/api/admin/users/login/:login", async (req, res) => {
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
    console.log(error);
    res.status(500).send({
      status: 500,
      message: "Ошибка сервера!"
    });
  }
});

// Удаление записи о пользователе
app.delete("/api/admin/users/id/:id", async (req, res) => {
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
    console.log(error);
    res.status(500).send({
      status: 500,
      message: "Ошибка сервера!"
    });
  }
});

// Получение информации о количестве пользователей
app.get("/api/admin/users/count", async (req, res) => {
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
});

app.get("/api/admin/users/list/:offset", async (req, res) => {
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
});

// Получение данных о конкретной карточке
app.get("/api/cards/:id", async (req, res) => {
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
        let result = await Cards.findOne({
          where: {
            card_id: req.params.id
          },
          order: [["updatedAt", "DESC"]]
        });
        res.send(result);
      }
    }
  );
});

// Получение данных о всех карточках
app.get("/api/cards", async (req, res) => {
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
        let result = await Cards.findAll({
          attributes: [
            ["card_id", "id"],
            "title",
            "text",
            "coefs",
            "templateText",
            "cost",
            "duration",
            "oneOff"
          ],
          order: [["card_id", "ASC"]]
        });
        res.send(result);
      }
    }
  );
});

// Запись глобальной конфигурации для админпанели
app.post("/api/admin/config", async (req, res) => {
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
        let lastConfig = await db.GameConfig.findOne({
          limit: 1,
          order: [["createdAt", "DESC"]]
        });
        let result = await db.GameConfig.create({
          event_chance: req.body.event_chance || lastConfig.event_chance
        });
        res.send(result);
      }
    }
  );
});

// Получение глобальной конфигурации для админпанели
app.get("/api/admin/config", async (req, res) => {
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
        let result = await db.GameConfig.findOne({
          limit: 1,
          order: [["createdAt", "DESC"]]
        });
        res.send(result);
      }
    }
  );
});

// Получение всех пользователей комнаты для админпанели
app.get("/api/admin/rooms/:id/users", async (req, res) => {
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
        let result = await db.UserInRoom.findAll({
          where: {
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
            },
            {
              model: db.UsedCards,
              as: "used_cards"
            }
          ]
        });
        res.send(result);
      }
    }
  );
});

// Получение конкретной комнаты для админпанели
app.get("/api/admin/rooms/:id", async (req, res) => {
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
        let result = await db.Room.findAll({
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
        res.send(result);
      }
    }
  );
});

// Получение всех комнат для админпанели
app.get("/api/admin/rooms", async (req, res) => {
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
        let result = await db.Room.findAll({
          order: [["room_id", "DESC"]],
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
        res.send(result);
      }
    }
  );
});

// Авторизация
app.post("/api/login", (req, res) => {
  // console.log("LOGIN: ", req.body);
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

app.use(history());

// Запуск сервера на порте
const server = app
  .use("/", serveStatic(path.join(__dirname, "../dist")))
  .listen(port, () => {
    console.log(`server running on port ${port} 1627`);
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
        console.log("socket io use 1655");
        return next(new Error("Authentication error"));
      }
      socket.decoded_token = decoded;
      next();
    });
  } else {
    next(new Error("Authentication error"));
  }
});

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

  // При отправке игроком сообщения
  require("./socket_events/message_events")(socket, io);

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
  require("./socket_events/do_step")(socket, io, db);

  // При потере подключения
  require("./socket_events/disconnect")(socket, io, db);
});

// io.on("connection",
//   function (socket) {
//     console.log('hello!', socket.decoded_token);
//     connections.push(socket.id);
//     console.log("Подключения:", connections);

//     // Пересылка сообщения

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
//     let refreshUser = disconnecteddb.User.find(el => el.id === oldSocketId);
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
