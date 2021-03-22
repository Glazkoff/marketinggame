const { logSocketOutEvent, logSocketError, logCommonError } = require("./logs");
const {sendAdminMessage,} = require("../global_functions/messages");
const db = require("../models/index");

module.exports = {
  // Отправить состояния игроков в комнату
  // FIXME roomId приходит в -1
  async sendGamers(io, db, roomId) {
    try {
      if (
        roomId !== null && 
        roomId !== undefined 
        // && roomId != -1
      ) {
        // Находим пользователей в комнате
        let usersInRoom = await db.UserInRoom.findAll({
          where: {
            room_id: roomId
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
        let gamersObj = usersInRoom.map(el => {
          return {
            id: el.user.user_id,
            name: el.user.name,
            isattacker: el.isattacker,
            isdisconnected: el.isdisconnected
          };
        });
        let gamerNamesObj = {
          gamers: gamersObj
        };

        // Отправляем состояние игроков всем в комнате
        io.in(roomId).emit("setGamers", gamerNamesObj);

        // Логируем исходящее событие
        logSocketOutEvent(
          "setGamers",
          "Отправляем состояние игроков всем в комнате"
        );
      } else {
        throw new Error("Нет номера комнаты!");
      }
    } catch (error) {
      logSocketError("game_process", error);
    }
  },

  // Получить ID всех одноразовых карточек
  async getOneOffCardsId() {
    let result;
    try {
      result = await db.Card.findAll({
        attributes: ["card_id"],
        where: {
          oneOff: true
        }
      });
    } catch (error) {
      logCommonError("game_process", error);
    }
    return result;
  },

  // Посчитать клиентов за месяц по формуле
  // параметры(счётчик_параметра * коэффициент_параметра * конверсия)
  calculateClientsForMonth(gamerRoomParams) {
    if (
      gamerRoomParams != null &&
      gamerRoomParams.conversion != null &&
      gamerRoomParams.organicCount != null &&
      gamerRoomParams.organicCoef != null &&
      gamerRoomParams.contextCount != null &&
      gamerRoomParams.contextCoef != null &&
      gamerRoomParams.socialsCount != null &&
      gamerRoomParams.socialsCoef != null &&
      gamerRoomParams.smmCount != null &&
      gamerRoomParams.smmCoef != null &&
      gamerRoomParams.straightCount != null &&
      gamerRoomParams.straightCoef != null
    ) {
      return (
        Math.ceil(
          gamerRoomParams.organicCount *
            gamerRoomParams.organicCoef *
            gamerRoomParams.conversion
        ) +
        Math.ceil(
          gamerRoomParams.contextCount *
            gamerRoomParams.contextCoef *
            gamerRoomParams.conversion
        ) +
        Math.ceil(
          gamerRoomParams.socialsCount *
            gamerRoomParams.socialsCoef *
            gamerRoomParams.conversion
        ) +
        Math.ceil(
          gamerRoomParams.smmCount *
            gamerRoomParams.smmCoef *
            gamerRoomParams.conversion
        ) +
        Math.ceil(
          gamerRoomParams.straightCount *
            gamerRoomParams.straightCoef *
            gamerRoomParams.conversion
        )
      );
    } else {
      return -1;
    }
  },

  // Посчитать деньги за месяц по формуле
  //  клиенты за месяц * средний чек
  calculateMoneyForMonth(gamerRoomParams) {
    let clients = module.exports.calculateClientsForMonth(gamerRoomParams);
    if (clients !== -1 && gamerRoomParams.averageCheck != null) {
      return Math.ceil(clients * gamerRoomParams.averageCheck);
    } else {
      return -1;
    }
  },

  async finishGame(io, db, room){
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
        },
        {
          model: db.UserStepState,
          as: "user_steps_state",
          include: [
            {
              model: db.MoneyResultState,
              as: "money_result_state"
            }
          ]
        }
      ]
    });

    let gamersRate = [];
    for (const gamer of gamers) {
      let moneySum = 0;
      let clientsSum = 0;
      gamer.user_steps_state.forEach(state => {
        moneySum += state.money_result_state.money_for_month;
        clientsSum += state.money_result_state.clients_for_month;
      });
      let position = {
        id: gamer.user_id,
        money: moneySum,
        clients: clientsSum
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
        if (person !== null) {
          winners[index].name = person.name;
        }
      } else winners[index] = a;
    }

    // Отправляем сообщеник о конце игры
    sendAdminMessage(io, room.roomId, `Конец игры в комнате!`);

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

    // Очистка last_room после завершения игры
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

    // Отправляем событие о конце игры
    io.in(room.room_id).emit("finish", winners);
    // Логируем исходящее событие
    logSocketOutEvent("finish", "Событие о конце игры");
  },

  async isCurrentStepFinished(io, db, room){
    // Статус хода по умолчанию
    let stepStatus = {
      finished: false, // Закончен ли ход
      activeParticipants: 0, // Активные=Неотключенные участники комнаты
      didStepCurrMonth: 0 // Количество ходов всех игроков за текущий месяц
    }

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
      stepStatus.activeParticipants = participantsArray.length;

      // Подсчет ходов за текущий месяц
      stepStatus.didStepCurrMonth = await db.UserStepState.count({
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

      // Подсчет отключенных игроков
      let loosedParticipants = await db.UserInRoom.count({
        where: {
          isdisconnected: true,
          room_id: room.room_id
        }
      });

      // Подсчет активных игроков
      stepStatus.activeParticipants -= loosedParticipants;

      // Все ли сделали ход?
      stepStatus.finished = stepStatus.didStepCurrMonth >= stepStatus.activeParticipants;

      return stepStatus
    }
    else {
      // Что-то не так с параметрами ходов пользователя
    }
  },

  async cardsProcessing(gamer, cardArr) {
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
        console.log(effect)
        // Добавление в объект использованных карточек
        if (effect.step === effect.duration - 1) {
          // Находим карту для эффекта
          let usedCard = await db.UsedCards.findOne({
            where: {
              user_in_room_id: gamer.user_in_room_id,
              card_id: effect.id
            }
          });

          // Если карта нашлась
          if (usedCard) {
            // Увеличиваем счётчик серий использований карты
            await db.UsedCards.update(
              { amount: usedCard.dataValues.amount + 1 },
              {
                where: {
                  user_in_room_id: gamer.user_in_room_id,
                  card_id: effect.id
                }
              }
            );
          }
          // Если карта не нашлась
          else {
            // Создаём счётчик серий использований карты
            await db.UsedCards.create({
              amount: 1,
              user_in_room_id: gamer.user_in_room_id,
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

      // Обработка пришедшего массива ID карточек
      for (const cardId of cardArr) {
        // Находим объект карточки на основе пришедшего ID
        let card = await db.Card.findOne({
          where: {
            card_id: cardId
          },
          order: [["updatedAt", "DESC"]]
        });

        // Вычитаем стоимость карточки из кошелька
        gamer.gamer_room_params.money -= card.cost;

        // Получаем одноразовые карточки
        let oneWayCards = await module.exports.getOneOffCardsId();
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
      } // Конец обработки пришедшего массива ID карточек
    }
  }
};

