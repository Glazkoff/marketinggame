const {
  logSocketInEvent,
  logSocketOutEvent
} = require("../global_functions/logs");
const { sendGamers } = require("../global_functions/game_process");

module.exports = function(socket, io, db) {
  // При выполнении хода
  socket.on("doStep", async function(cardArr) {
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

      let user = await db.User.findOne({
        where: {
          user_id: socket.decoded_token.id
        },
        attributes: ["last_room"]
      });

      // Находим комнату, которая является последней, содержащей пользователя
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
      // room = room.dataValues;

      // Устанавливаем текущему игроку, что ход был сделан

      // Устанавливаем, что пользователи комнаты
      await db.UserInRoom.update(
        {
          isdisconnected: false
        },
        {
          where: {
            room_id: room.room_id
          }
        }
      );

      // // Находим пользователя в комнате
      // let usersInRoom = await db.UserInRoom.findAll({
      //   where: {
      //     user_in_room_id: userInRoom.user_in_room_id
      //   },
      //   attributes: ["isattacker", "isdisconnected"],
      //   include: [
      //     {
      //       model: db.User,
      //       as: "user",
      //       attributes: ["user_id", "name"]
      //     }
      //   ]
      // });

      // // Формируем объект пользователей для фронтенда
      // let gamersObj = [];
      // if (usersInRoom.length !== 0) {
      //   usersInRoom.forEach(el => {
      //     gamersObj.push({
      //       id: el.user.user_id,
      //       name: el.user.name,
      //       isattacker: el.isattacker,
      //       isdisconnected: el.isdisconnected
      //     });
      //   });
      // }
      // let gamerNamesObj = {
      //   gamers: gamersObj
      // };

      // // Отправляем объект с состояниями ходов игроков всем в комнате
      // io.in(room.room_id).eit("setGamers", gamerNamesObj);

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

      // Если у пользователя не отсутсвуют активные эффекты
      if (gamer.effects !== null) {
        // Проходимся по всему массиву эффектов, чтобы проверить,
        // прислали ли карточку для продления серии
        for (let effectId = 0; effectId < gamer.effects.length; effectId++) {
          let effect = gamer.effects[effectId];
          let cardArrIndex = cardArr.findIndex(elem => elem === effect.id);
          // Если в пришедшем массиве ID карточек нет эффекта из цикла
          // (если не прислали повторно), то удаляем из массива эффектов игрока
          if (cardArrIndex === -1) {
            let effectIndex = gamer.effects.findIndex(
              elem => elem.id === effect.id
            );
            gamer.effects.splice(effectIndex, 1);
            effectId--;
          }

          // Добавление в объект использованных карточек
          if (effect.step === effect.duration) {
            let usedCard = await db.UsedCards.findOne({
              where: {
                user_in_room_id: userInRoom.user_in_room_id,
                card_id: effect.id
              }
            });

            if (usedCard) {
              await db.UsedCards.update(
                { amount: usedCard.dataValues.amount + 1 },
                {
                  where: {
                    user_in_room_id: userInRoom.user_in_room_id,
                    card_id: effect.id
                  }
                }
              );
            } else {
              await db.UsedCards.create({
                amount: 1,
                user_in_room_id: userInRoom.user_in_room_id,
                card_id: effect.id
              });
            }
          }
        }
      }

      // Если пришедший массив не пустой
      if (cardArr.length !== 0) {
        for (let effect of gamer.effects) {
          // Если в пришедшем массиве нет уже существующего эффекта
          // (если не прислали повторно), то удаляем из массива эффектов игрока
          let cardArrIndex = cardArr.findIndex(elem => elem === effect.id);
          if (cardArrIndex === -1) {
            let effectIndex = gamer.effects.findIndex(
              elem => elem.id === effect.id
            );
            gamer.effects.splice(effectIndex, 1);
          }

          // Если действие эффекта закончилось
          if (effect.step === effect.duration) {
            let effectIndex = gamer.effects.findIndex(
              elem => elem.id === effect.id
            );
            gamer.effects.splice(effectIndex, 1);
          }
        }

        // Обработка пришедшего массива ID карточек ------------------------------------------------
        for (const cardId of cardArr) {
          // TODO: сделать загрузку из БД
          // Находим объект карточки на основе пришедшего ID
          // let card = CARDS.find(el => el.id === cardId);
          let card = await Cards.findOne({
            where: {
              card_id: cardId
            },
            order: [["updatedAt", "DESC"]]
          });
          gamer.gamer_room_params.money -= card.cost;

          let oneWayCards = await getOneOffCardsId();
          let oneWayCardIndex = oneWayCards.findIndex(
            elem => elem.card_id === cardId
          );
          let effectIndex = gamer.effects.findIndex(elem => elem.id === cardId);

          // Если карточка не является одноразовой
          if (oneWayCardIndex === -1) {
            // Если эффекта ещё нет (карточка выбрасывается первый раз)
            if (effectIndex === -1) {
              // Занести свойства ещё не применённых изменений
              for (const changes of card.data_change) {
                let changeObj = {};
                for (var key in changes) {
                  changeObj[key] = changes[key];
                }
                gamer.changes.push(changeObj);
              }

              // Добавляем в массив эффектов
              let effectObj = {
                id: cardId,
                name: card.title,
                step: 1,
                duration: card.duration
              };
              gamer.effects.push(effectObj);
            } else if (gamer.effects[effectIndex].step < card.duration) {
              // Если эффект уже существует в массиве, увеличиваем на 1 его шаг
              gamer.effects[effectIndex].step++;
              if (gamer.effects[effectIndex].step === card.duration) {
                gamer.effects.splice(effectIndex, 1);
              }
            }
          }
          // Иначе, если карточки одноразовые
          else {
            if (effectIndex === -1) {
              // Занести свойства одноразовых карточек
              for (const changes of card.data_change) {
                let changeObj = {};
                for (var k in changes) {
                  changeObj[k] = changes[k];
                }
                gamer.changes.push(changeObj);
              }
            }
          }
        } // Конец обработки пришедшего массива ID карточек ------------------------------------------------
      }

      // Создание массива для всех отсылаемых сообщениях
      let messageArr = [];

      // Высчитывание всех параметров
      let clients =
        (gamer.gamer_room_params.organicCount *
          gamer.gamer_room_params.organicCoef +
          gamer.gamer_room_params.contextCount *
            gamer.gamer_room_params.contextCoef +
          gamer.gamer_room_params.socialsCount *
            gamer.gamer_room_params.socialsCoef +
          gamer.gamer_room_params.smmCount * gamer.gamer_room_params.smmCoef +
          gamer.gamer_room_params.straightCount *
            gamer.gamer_room_params.straightCoef) *
        gamer.gamer_room_params.conversion;
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
        let oneWayCards = await getOneOffCardsId();
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
            let usedCard = await db.UsedCards.findOne({
              where: {
                user_in_room_id: userInRoom.user_in_room_id,
                card_id: changing.id
              }
            });

            if (usedCard == null) {
              // if (typeof gamer.used_сards[`${changing.id}`] === "undefined") {
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
                  // messageArr.push(
                  //   "Что-то не так с операцией карточки по ID " + card.id
                  // );
                  break;
              }
            } else {
              let changeCoef = changing.change;
              if (usedCard["amount"] !== 0) {
                for (let i = 0; i < usedCard["amount"]; i++) {
                  changeCoef = (1 + changeCoef) / 2;
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
                  // messageArr.push(
                  //   "Что-то не так с операцией карточки по ID " + card.id
                  // );
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
                analyticsString += "параметр Соц. медиа";
                break;
              case "socialsCoef":
                analyticsString += "параметр Реклама: соцсети";
                break;
              case "averageCheck":
                analyticsString += "параметр Средний";
                break;

              default:
                analyticsString += "параметр " + changing.param;
                break;
            }
            if (
              changing.param === "smmCount" ||
              changing.param === "socialsCoef"
            ) {
              analyticsString +=
                " со знаком " +
                changing.operation +
                " на " +
                changing.change +
                " (Нанять SMM-менеджера)";
            } else if (changing.param === "smmCoef") {
              analyticsString +=
                " со знаком " +
                changing.operation +
                " на " +
                changing.change +
                " (Улучшение юзабилити)";
            } else {
              if (usedCard !== null) {
                if (usedCard["amount"] >= 1) {
                  let changeCoef = changing.change;
                  if (usedCard["amount"] !== 0) {
                    for (let i = 0; i < usedCard["amount"]; i++) {
                      changeCoef = (1 + changeCoef) / 2;
                      if (changing.change >= 10) {
                        changeCoef = Math.ceil(changeCoef);
                      }
                    }
                  }
                  analyticsString +=
                    " со знаком " +
                    changing.operation +
                    " на " +
                    changeCoef +
                    " (" +
                    changing.from +
                    ")";
                } else {
                  analyticsString +=
                    " со знаком " +
                    changing.operation +
                    " на " +
                    changing.change +
                    " (" +
                    changing.from +
                    ")";
                }
              }
            }
            console.log("непонятно что 2323");
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
          await db.UserStepState.create({
            user_in_room_id: userInRoom.user_in_room_id,
            month: room.current_month,
            makeStep: true
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
            await db.UserStepState.create({
              user_in_room_id: userInRoom.user_in_room_id,
              month: room.current_month,
              makeStep: true
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
        await db.UserStepState.create({
          user_in_room_id: userInRoom.user_in_room_id,
          month: room.current_month,
          makeStep: true
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

      // Количество пользователей в команте, которые сделали ход в текцщий месяц
      let didStepCurrMonth = 0;

      // Все ли пользователи ход? Нет по умолчанию
      let allGamersDoStep = false;

      let participants = await db.UserInRoom.findAll({
        attributes: ["user_id"],
        where: {
          room_id: room.room_id
        }
      });
      let participantsArray = participants.map(el => {
        return el.user_id;
      });

      // Если корректно установлены параметры комнаты
      if (participantsArray !== null) {
        let activeParticipants = participantsArray.length;

        console.log("подсчет участников сделавших ход 2491");

        didStepCurrMonth = await db.UserStepState.count({
          where: {
            month: room.current_month,
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

        let loosedParticipants = await db.UserStepState.count({
          where: {
            "$user_in_room.isdisconnected$": true,
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

        activeParticipants -= loosedParticipants;

        console.log(
          chalk.bgGreen(`РЕЗУЛЬТАТ! didStepCurrMonth: ${didStepCurrMonth} 2512`)
        );
        console.log(
          chalk.bgGreen(
            `РЕЗУЛЬТАТ! activeParticipants: ${activeParticipants} 2515`
          )
        );
        console.log(
          chalk.bgGreen(`--- ПОДСЧЁТ СХОДИВШИХ УЧАСТНИКОВ ЗАКОНЧЕН 2517`)
        );

        // !!! Когда все в комнате сделали ход
        if (didStepCurrMonth === activeParticipants) {
          console.log("Все пользователи сделали ход 2521");
          allGamersDoStep = true;

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
          console.log("Не все пользователи сделали ход 2543");
          console.log("2544 За этот месяц: ", didStepCurrMonth);
          console.log("2545 Активных участников: ", activeParticipants);
          console.log(" 2546 Всего участников: ", participantsArray.length);
        }
      } else {
        console.log("Что-то не так с параметрами ходов пользователя 2549");
      }
      // Отправка сообщений об изменениях
      if (messageArr.length !== 0) {
        for (let index = 0; index < messageArr.length; index++) {
          io.sockets.to(socket.id).emit("addMessage", {
            name: "ОТДЕЛ АНАЛИТИКИ ",
            text: messageArr[index]
          });
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
        }

        // Если текущий месяц меньше количества запланированных
        if (room.first_params.month > room.current_month) {
          room.current_month++;
          // console.log(
          //   chalk.bgBlue(
          //     "Сменился месяц в комнате #" + room.room_id,
          //     `(${room.current_month}, ${room.first_params.month})`
          //   )
          // );
          console.log("месяцы ещё есть 2586");
          await db.Room.update(
            {
              current_month: sequelize.literal("current_month + 1")
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
      if (Math.random() < lastConfig.event_chance && allGamersDoStep) {
        // if (Math.floor(Math.random() * 10) % 2 === 0 && allGamersDoStep) {
        // console.log(chalk.bgBlue("Случайное событие #" + room.room_id));
        console.log("случайное событие 2607 ");

        // TODO: сделать загрузку массива
        // Получаем случайный объект из массива событий
        let randomEvent = EVENTS[Math.floor(Math.random() * EVENTS.length)];
        // console.log(
        //   chalk.bgRed("Случайное событие #", JSON.stringify(randomEvent))
        // );
        console.log("выбор случайного события 2615");
        if (randomEvent.dataChange !== undefined) {
          // console.log(chalk.bgYellow("$1$"));

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
                    console.log("Что-то не так с событием 2644 карточка - ");
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
        io.in(room.room_id).emit("gameEvent", randomEvent);
        io.in(room.room_id).emit("addMessage", {
          name: "СОБЫТИЕ!",
          text: `${randomEvent.description}`
        });
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
        // console.log(chalk.bgBlueBright("Игра завершается #" + room.room_id));
        console.log("завершение игры 2736");

        let gamers = await db.UserInRoom.findAll({
          where: {
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
        // console.log(chalk.red(JSON.stringify(gamers)));
        // gamers = gamers.dataValues;
        // console.log(chalk.red(gamers));
        let gamersRate = [];
        for (const gamer of gamers) {
          let position = {
            id: gamer.user_id,
            money:
              (Math.ceil(
                gamer.gamer_room_params.organicCount *
                  gamer.gamer_room_params.organicCoef *
                  gamer.gamer_room_params.conversion
              ) +
                Math.ceil(
                  gamer.gamer_room_params.contextCount *
                    gamer.gamer_room_params.contextCoef *
                    gamer.gamer_room_params.conversion
                ) +
                Math.ceil(
                  gamer.gamer_room_params.socialsCount *
                    gamer.gamer_room_params.socialsCoef *
                    gamer.gamer_room_params.conversion
                ) +
                Math.ceil(
                  gamer.gamer_room_params.smmCount *
                    gamer.gamer_room_params.smmCoef *
                    gamer.gamer_room_params.conversion
                ) +
                Math.ceil(
                  gamer.gamer_room_params.straightCount *
                    gamer.gamer_room_params.straightCoef *
                    gamer.gamer_room_params.conversion
                )) *
              gamer.gamer_room_params.averageCheck
          };
          gamersRate.push(position);
        }

        if (gamers.length === 1) {
          let position = {
            id: -1,
            money: 0
          };
          gamersRate.push(position);
          gamersRate.push(position);
        } else {
          let position = {
            id: -1,
            money: 0
          };
          gamersRate.push(position);
        }

        gamersRate.sort((a, b) => {
          if (a.money > b.money) {
            return -1;
          } else if (a.money < b.money) {
            return 1;
          }
          return 0;
        });

        let winners = {};
        for (let index = 1; index < 4; index++) {
          let a = gamersRate.shift();
          if (typeof a !== "undefined") {
            winners[index] = Object.assign(a);
            let person = await db.User.findOne({
              where: {
                user_id: a.id
              }
            });
            console.log("INDEX " + index);
            if (person !== null) {
              winners[index].name = person.name;
            }
          } else winners[index] = a;
        }

        io.sockets.to(room.roomId).emit("addMessage", {
          name: "Admin",
          text: `Конец игры в комнате!`
        });
        console.log("победители 2825");

        await db.Room.update(
          {
            is_finished: true
          },
          {
            where: {
              room_id: room.room_id
            }
          }
        );

        if (winners["1"].id !== -1) {
          await db.Winner.create({
            user_id: winners["1"].id,
            room_id: room.room_id,
            money: winners["1"].money,
            place: 1
          });
        }
        if (winners["2"].id !== -1) {
          await db.Winner.create({
            user_id: winners["2"].id,
            room_id: room.room_id,
            money: winners["2"].money,
            place: 2
          });
        }
        if (winners["3"].id !== -1) {
          await db.Winner.create({
            user_id: winners["3"].id,
            room_id: room.room_id,
            money: winners["3"].money,
            place: 3
          });
        }

        // #region Очистка last_room после завершения игры
        for (const gamer of gamers) {
          db.User.update(
            {
              last_room: null
            },
            {
              where: {
                user_id: gamer.user_id
              }
            }
          );
        }
        // #endregion
        console.log(winners);
        io.in(room.room_id).emit("finish", winners);
      } else {
        // console.log(chalk.bgBlue("Игра продолжается"));
        // console.log(chalk.bgBlue(room.current_month));
        // console.log(chalk.bgBlue(room.first_params.month));
        console.log("игра продолжается 2842");
      }

      //  TODO: send effects
      //     for (const gamer of gamers) {
      //       io.sockets.to(gamer.id).emit("setEffects", gamer.effects);
      //     }
    } catch (error) {
      console.log(error);
    }

    io.sockets.to(socket.id).emit("addMessage", {
      name: "Admin",
      text: `Вы сделали ход!`
    });
  });
};
