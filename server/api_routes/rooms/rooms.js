const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Sequelize = require("sequelize");
const JWTCONFIG = require("../../secret.config");
const db = require("../../models/index");
const { logRestApiError } = require("../../global_functions/logs");
const { sendGamers } = require("../../global_functions/game_process");

function getRoomsRouter(io) {
  // Создание новой команты
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
            let userLastRoomValid = await db.User.findOne({
              where: {
                user_id: decoded.id
              },
              attributes: ["last_room"]
            });
            if (userLastRoomValid !== null) {
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

                result.dataValues.prev_room_params =
                  result.dataValues.first_params;
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
                );
                // #endregion

                res.send(result);
              } else {
                res.send({
                  status: 400,
                  message:
                    "Вы уже находитесь в другой комнате! Ваша последняя комната - " +
                    userLastRoomValid.last_room
                });
              }
            }
          }
        }
      );
    } catch (error) {
      logRestApiError("rooms", error);
      res.status(500).send({
        status: 500,
        message: "Ошибка создания комнаты!"
      });
    }
  });

  // Присоединение к комнате
  router.post("/join/:id", async (req, res) => {
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
                    if (
                      !user.last_room ||
                      user.last_room === findRoom.room_id
                    ) {
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
                        );
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

                          // Отправляем состояние пользователей в комнате
                          sendGamers(io, db, req.params.id);

                          res.send(findRoom.dataValues);
                        }

                        // Находим комнату
                        findRoom = await db.Room.findOne({
                          where: {
                            room_id: findRoom.room_id
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

                        // Отправляем состояние пользователей в комнате
                        sendGamers(io, db, req.params.id);
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
    } catch (error) {
      logRestApiError("rooms", error);
      res.status(500).send({
        status: 500,
        message: "Ошибка присоединения к комнате!"
      });
    }
  });

  // TODO: присылать события и список игроков
  // Попытка переподключения
  router.get("/reset", async (req, res) => {
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
                  // Отправляем состояние пользователей в комнате
                  sendGamers(io, db, req.params.id);

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
          }
        }
      );
    } catch (error) {
      logRestApiError("rooms", error);
      res.status(500).send({
        status: 500,
        message: "Ошибка попытки переподключения!"
      });
    }
  });

  return router;
}

module.exports = getRoomsRouter;
