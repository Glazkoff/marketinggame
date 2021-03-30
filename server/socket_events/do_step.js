const {
  logSocketInEvent,
  logSocketOutEvent,
  logSocketError,
  logDBdata
} = require("../global_functions/logs");
const {
  sendGamers,
  getOneOffCardsId,
  calculateMoneyForMonth,
  calculateClientsForMonth,
  isCurrentStepFinished,
  finishGame,
  cardsProcessing
} = require("../global_functions/game_process");
const {
  sendAdminMessage,
  sendAnalyticsMessage,
  sendEventMessage
} = require("../global_functions/messages");
const Sequelize = require("sequelize");

module.exports = function (socket, io, db) {
  // При выполнении хода
  socket.on("doStep", async function (cardArr) {
    // Логируем входящее событие
    logSocketInEvent("doStep", "При выполнении хода");

    try {
      // Находим данные об игроке
      let gamer = await db.UserInRoom.findOne({
        where: {
          user_id: socket.decoded_token.id,
          room_id: socket.roomId
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

      // TODO: проверить почему и главное зачем
      let userInRoom = await db.UserInRoom.findOne({
        where: {
          user_id: socket.decoded_token.id,
          room_id: socket.roomId
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

      // Находим номер последней комнаты
      let user = await db.User.findOne({
        where: {
          user_id: socket.decoded_token.id
        },
        attributes: ["last_room"]
      });

      // Находим последнюю комнату пользователя
      let room = await db.Room.findOne({
        where: {
          room_id: user.last_room,
          is_finished: false
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
        ],
        order: [["updatedAt", "DESC"]]
      });

      if (room.first_params.month > room.current_month) {
        // Устанавливаем текущему игроку, что ход был сделан

        // Устанавливаем, что пользователь совершил ход
        await db.UserInRoom.update(
          {
            isdisconnected: false,
            isattacker: true
          },
          {
            where: {
              room_id: room.room_id,
              user_id: socket.decoded_token.id
            }
          }
        );

        // Отправляем объект с состояниями ходов игроков всем в комнате
        await sendGamers(io, db, room.room_id);

        // Копируем неизменённые данные в колонку "предыдущие парметры"
        gamer.prev_room_params = {
          ...gamer.gamer_room_params.dataValues
        };

        gamer.gamer_room_params = {
          ...gamer.gamer_room_params.dataValues
        };

        // (?) Уменьшаем количество оставшихся месяцев
        gamer.gamer_room_params.month--;

        // Обработка карточек на обнуление или прибавление эффектов
        gamer = await cardsProcessing(gamer, cardArr)
        // Создание массива для всех отсылаемых сообщениях
        let messageArr = [];

        // Высчитывание всех параметров
        let clients = calculateClientsForMonth(gamer.gamer_room_params);
        gamer.gamer_room_params.clients = Math.ceil(clients);
        let averageCheck = gamer.gamer_room_params.averageCheck;
        let realCostAttract = gamer.gamer_room_params.realCostAttract;
        let commCircul = clients * averageCheck;
        gamer.gamer_room_params.commCircul = commCircul;
        let expenses = clients * realCostAttract;
        gamer.gamer_room_params.expenses = expenses;
        let result = commCircul - expenses;

        gamer.gamer_room_params.money += room.budget_per_month;

        messageArr.push(
          "Пришёл бюджет на месяц (+" + Math.ceil(room.budget_per_month) + "₽)"
        );
        let resultPerClient = result / clients;
        gamer.gamer_room_params.moneyPerClient = Math.ceil(resultPerClient);

        // Для каждого изменения
        let iter = 0;
        let indexEffArr;
        for (let index = 0; index < gamer.changes.length; index++) {
          let changing = gamer.changes[index];
          // Для ID изменения changing.id индекс в массиве эфф. равен indexEffArr
          indexEffArr = gamer.effects.findIndex(elem => elem.id === changing.id);
          let oneWayCards = await getOneOffCardsId(db.Cards);
          let oneWayChangingId = oneWayCards.findIndex(
            el => el.card_id === changing.id
          );
          if (
            indexEffArr === -1 &&
            oneWayChangingId === -1 &&
            changing.event === undefined
          ) {
            for (let index = 0; index < gamer.changes.length; index++) {
              if (gamer.changes[index].id === changing.id) {
                gamer.changes[index].toDelete = true;
              }
            }
          }
          if (changing.when === 1) {
            if (
              gamer.effects.findIndex(elem => elem.id === changing.id) !== -1 ||
              oneWayChangingId ||
              changing.event
            ) {
              // TODO: Возможно, надо добавить проверку, что карта многоразовая
              let usedCard = await db.UsedCards.findOne({
                where: {
                  user_in_room_id: userInRoom.user_in_room_id,
                  card_id: changing.id
                }
              });


              if (usedCard == null) {
                switch (changing.operation) {
                  case "+":
                    gamer.gamer_room_params[changing.param] += changing.change;
                    break;
                  case "-":
                    gamer.gamer_room_params[changing.param] -= changing.change;
                    break;
                  case "*":
                    gamer.gamer_room_params[changing.param] *= changing.change;
                    break;
                  default:
                    // Что-то не так с операцией карточки
                    break;
                }
              } else {
                let changeCoef = changing.change;
                if (usedCard["amount"] !== 0) {
                  for (let i = 0; i < usedCard["amount"]; i++) {
                    if (changing.change >= 10) {
                      changeCoef = Math.ceil(changeCoef);
                    }
                  }
                }
                switch (changing.operation) {
                  case "+":
                    gamer.gamer_room_params[changing.param] += changeCoef;
                    break;
                  case "-":
                    gamer.gamer_room_params[changing.param] -= changeCoef;
                    break;
                  case "*":
                    gamer.gamer_room_params[changing.param] *= changeCoef;
                    break;
                  default:
                    // Что-то не так с операцией карточки
                    break;
                }
              }
              let analyticsString = "Обновлён  ";
              switch (changing.param) {
                case "organicCoef":
                  analyticsString += 'параметр "Органика"';
                  break;
                case "organicCount":
                  analyticsString += 'параметр "Органика"';
                  break;
                case "contextCount":
                  analyticsString += 'параметр "Реклама: контекст"';
                  break;
                case "contextCoef":
                  analyticsString += 'параметр "Реклама: контекст"';
                  break;
                case "socialsCount":
                  analyticsString += 'параметр "Реклама: соцсети"';
                  break;
                case "smmCount":
                  analyticsString += 'параметр "Соц. медиа"';
                  break;
                case "straightCount":
                  analyticsString += 'параметр "Прямой заход"';
                  break;
                case "straightCoef":
                  analyticsString += 'параметр "Прямой заход"';
                  break;
                case "smmCoef":
                  analyticsString += 'параметр "Соц. медиа"';
                  break;
                case "socialsCoef":
                  analyticsString += 'параметр "Реклама: соцсети"';
                  break;
                case "averageCheck":
                  analyticsString += 'параметр "Средний чек"';
                  break;
                case "conversion":
                  analyticsString += 'параметр "Конверсия"';
                  break;
                default:
                  analyticsString += 'параметр "' + changing.param + '"';
                  break;
              }
              messageArr.push(analyticsString);

              let indForDelete = gamer.changes.findIndex(elem => {
                return (
                  elem.id === changing.id &&
                  elem.change === changing.change &&
                  elem.param === changing.param
                );
              });

              if (indForDelete !== -1) {
                gamer.changes[indForDelete].toDelete = true;
              }
            } else {
              for (let index = 0; index < gamer.changes.length; index++) {
                if (gamer.changes[index].id === changing.id) {
                  gamer.changes[index].toDelete = true;
                }
              }
            }
            gamer.changes[iter].toDelete = true;
          } else {
            iter++;
          }
        } // Конец обработки пришедшего массива

        // Удаляем подготовленные к удалению объекты
        gamer.changes.filter(el => {
          return el.toDelete !== true;
        });

        // TODO: понять, почему происходило обновление Used cards

        await db.UserInRoom.update(
          {
            effects: gamer.effects,
            changes: gamer.changes
          },
          {
            where: {
              user_id: socket.decoded_token.id,
              room_id: room.room_id
            }
          }
        );

        // FIXME: !!!
        await db.GamerRoomParams.update(gamer.gamer_room_params, {
          where: {
            user_in_room_id: gamer.user_in_room_id
          }
        });

        await db.PrevRoomParams.update(gamer.prev_room_params, {
          where: {
            user_in_room_id: gamer.user_in_room_id
          }
        });

        // TODO: Посылаем событие на изменение статуса участника
        io.sockets.to(socket.roomId).emit("changeGamerStatus", socket.id);
        // Логируем исходящее событие
        logSocketOutEvent(
          "changeGamerStatus",
          "Отправляем комнате изменение статуса участника"
        );

        // Подсчёт всех ходов в комнате
        let allUsersStepsStateCount = await db.UserStepState.count({
          where: {
            "$user_in_room.room_id$": room.room_id
          },
          include: [
            {
              model: db.UserInRoom,
              as: "user_in_room",
              attributes: []
            }
          ]
        });

        // Если в комнате уже были шаги
        if (allUsersStepsStateCount !== 0) {
          let userStepsStateCount = await db.UserStepState.count({
            where: {
              user_in_room_id: userInRoom.user_in_room_id
            }
          });

          // Если пользователь делает шаг первый раз
          if (userStepsStateCount === -1) {
            let userStepState = await db.UserStepState.create({
              user_in_room_id: userInRoom.user_in_room_id,
              month: room.current_month,
              makeStep: true
            });

            // Фиксируем заработок за месяц
            await db.MoneyResultState.create({
              step_state_id: userStepState.step_state_id,
              money_for_month: calculateMoneyForMonth(gamer.gamer_room_params),
              clients_for_month: calculateClientsForMonth(gamer.gamer_room_params)
            });

            await db.UserInRoom.update(
              {
                isattacker: true,
                isdisconnected: false
              },
              {
                where: {
                  user_in_room_id: userInRoom.user_in_room_id
                }
              }
            );
          }
          // Если пользователь уже делал шаг
          else {
            let userCurrentStep = await db.UserStepState.findOne({
              where: {
                user_in_room_id: userInRoom.user_in_room_id,
                month: room.current_month
              }
            });

            // Если пользователь в этом месяце ещё не делал шаг
            if (userCurrentStep === null) {
              let userStepState = await db.UserStepState.create({
                user_in_room_id: userInRoom.user_in_room_id,
                month: room.current_month,
                makeStep: true
              });

              // Фиксируем заработок за месяц
              await db.MoneyResultState.create({
                step_state_id: userStepState.step_state_id,
                money_for_month: calculateMoneyForMonth(gamer.gamer_room_params),
                clients_for_month: calculateClientsForMonth(
                  gamer.gamer_room_params
                )
              });

              await db.UserInRoom.update(
                {
                  isattacker: true,
                  isdisconnected: false
                },
                {
                  where: {
                    user_in_room_id: userInRoom.user_in_room_id
                  }
                }
              );
            }
          }
        }
        // Если в комнате никто не делал шагов
        else {
          let userStepState = await db.UserStepState.create({
            user_in_room_id: userInRoom.user_in_room_id,
            month: room.current_month,
            makeStep: true
          });

          // Фиксируем заработок за месяц
          await db.MoneyResultState.create({
            step_state_id: userStepState.step_state_id,
            money_for_month: calculateMoneyForMonth(gamer.gamer_room_params),
            clients_for_month: calculateClientsForMonth(gamer.gamer_room_params)
          });

          await db.UserInRoom.update(
            {
              isattacker: true,
              isdisconnected: false
            },
            {
              where: {
                user_in_room_id: userInRoom.user_in_room_id
              }
            }
          );
        }

        const allGamersDoStep = (await isCurrentStepFinished(io, db, room)).finished

        let participants = await db.UserInRoom.findAll({
          attributes: ["user_id"],
          where: {
            room_id: room.room_id
          }
        });

        let participantsArray = participants.map(el => {
          return el.user_id;
        });

        // Когда все в комнате сделали ход
        if (allGamersDoStep) {

          await db.UserInRoom.update(
            {
              isattacker: false
            },
            {
              where: {
                room_id: room.room_id
              }
            }
          );

          // Отправляем состояние игроков всем в комнате
          sendGamers(io, db, room.room_id);

          // Отправляем начало нового хода
          io.in(socket.roomId).emit("doNextStep");
          // Логируем исходящее событие
          logSocketOutEvent(
            "changeGamerStatus",
            "Отправляем комнате изменение статуса участника"
          );
        }
        // Если число сходивших не равно количеству участников
        else {
          // Не все пользователи сделали ход
        }

        // Отправка сообщений об изменениях
        if (messageArr.length !== 0) {
          for (let index = 0; index < messageArr.length; index++) {
            sendAnalyticsMessage(io, socket.id, messageArr[index]);
          }
          messageArr = [];
        }

        // Когда все пользователи в комнате сходили
        if (allGamersDoStep) {
          let usersEffects = await db.UserInRoom.findAll({
            attributes: ["user_id", "effects"],
            where: {
              room_id: room.room_id
            }
          });
          for (const userWithEffects of usersEffects) {
            io.sockets
              .to("user" + userWithEffects.user_id)
              .emit("setEffects", userWithEffects.effects);
            // Логирование исходящего события
            logSocketOutEvent(
              `setEffects (user${userWithEffects.user_id})`,
              "Отправка эффектов"
            );
          }

          // Если текущий месяц меньше количества запланированных
          if (room.first_params.month > room.current_month) {
            room.current_month++;
            await db.Room.update(
              {
                current_month: Sequelize.literal("current_month + 1")
              },
              {
                where: {
                  room_id: room.room_id
                }
              }
            );
          }
        }
        let lastConfig = await db.GameConfig.findOne({
          limit: 1,
          order: [["createdAt", "DESC"]]
        });
        if (lastConfig == null) {
          lastConfig = await db.GameConfig.create({
            event_chance: 0.0
          });
          lastConfig = lastConfig.dataValues;
        }

        // Выбираем случайно гененрировать ли событие
        if (
          Math.random() < lastConfig.event_chance &&
          allGamersDoStep &&
          !(room.current_month >= room.first_params.month)
        ) {
          const EVENTS = await db.Event.findAll({
            where: {
              is_draft: false
            }
          });
          // TODO: сделать загрузку массива
          // Получаем случайный объект из массива событий
          let randomEvent = EVENTS[Math.floor(Math.random() * EVENTS.length)];

          if (randomEvent.dataChange !== undefined) {
            // Для каждого изменения
            for (const eventChange of randomEvent.dataChange) {
              // Если изменения при применении
              if (+eventChange.when === 0) {
                for (const gamerId of participantsArray) {
                  let userInRoom = await db.UserInRoom.findOne({
                    where: {
                      user_id: gamerId,
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
                  switch (eventChange.operation) {
                    case "+":
                      userInRoom.gamer_room_params[eventChange.param] +=
                        eventChange.change;
                      break;
                    case "-":
                      userInRoom.gamer_room_params[eventChange.param] -=
                        eventChange.change;
                      break;
                    case "*":
                      userInRoom.gamer_room_params[eventChange.param] *=
                        eventChange.change;
                      break;
                    default:
                      // Что-то не так с событием
                      break;
                  }

                  await db.GamerRoomParams.update(userInRoom.gamer_room_params, {
                    where: {
                      user_in_room_id: userInRoom.user_in_room_id
                    }
                  });
                }

                // Если изменение в следующие месяцы
              } else {
                for (const gamerId of participantsArray) {
                  let userInRoom = await db.UserInRoom.findOne({
                    where: {
                      user_id: gamerId,
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
                  userInRoom.changes.push(eventChange);
                  await db.UserInRoom.update(
                    {
                      changes: userInRoom.changes
                    },
                    {
                      where: {
                        user_id: gamerId,
                        room_id: room.room_id
                      }
                    }
                  );
                }
              }
            }
          }

          // Отправляем случайное событие
          io.in(room.room_id).emit("gameEvent", randomEvent);
          // Логируем исходящее событие
          logSocketOutEvent("gameEvent", "Отправляем случайное событие");

          // Отправляем случайное событие
          sendEventMessage(io, room.room_id, randomEvent.description);
        }
        for (let gamerId of participantsArray) {
          let userInRoom = await db.UserInRoom.findOne({
            where: {
              user_id: gamerId,
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
          userInRoom = userInRoom.dataValues;
          let obj = {
            data: {
              room_id: room.room_id,
              owner_id: room.owner_id,
              is_start: room.is_start,
              first_params: room.first_params,
              prev_room_params: userInRoom.prev_room_params,
              gamer_room_params: userInRoom.gamer_room_params
            }
          };
          io.sockets.to("user" + gamerId).emit("SET_GAME_PARAMS", obj);
          // Отправка новых данных состояния пользователю
        }

        for (let index = 0; index < gamer.changes.length; index++) {
          const changing = gamer.changes[index];
          changing.when--;
          if (changing.when < 1) {
            gamer.changes.splice(index, 1);
            index--;
          }
        }
        db.UserInRoom.update(
          {
            changes: gamer.changes
          },
          {
            where: {
              user_id: socket.decoded_token.id,
              room_id: room.room_id
            }
          }
        );

        // Если игра завершается
        if (room.current_month >= room.first_params.month) {
          // Завершение игры
          await finishGame(io, db, room)
        } else {
          // игра продолжается
        }

        //  TODO: send effects
        //     for (const gamer of gamers) {
        //       io.sockets.to(gamer.id).emit("setEffects", gamer.effects);
        //     }

        // Отправляем сообщение о завершённом ходе
        sendAdminMessage(io, socket.id, "Вы сделали ход!");
      }
    } catch (error) {
      // Логируем ошибки
      logSocketError("do_step", error);
    }
  });
};
