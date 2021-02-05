const {
  logSocketInEvent,
  logSocketOutEvent,
  logSocketError
} = require("../global_functions/logs");
const { sendGamers } = require("../global_functions/game_process");

module.exports = function(socket, io, db, Sequelize) {
  // При принудительном завершении хода
  socket.on("manualStepClose", async roomId => {
    // Логирование входящего запроса
    logSocketInEvent("manualStepClose", "Принудительное завершение хода");

    try {
      // Находим состояние текущей комнаты в БД
      let room = await db.Room.findOne({
        where: {
          room_id: roomId
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

      // Если текущий месяц не больше максимального количества месяцев
      if (room.first_params.month > room.current_month) {
        // Увеличиваем на 1 текущий месяц
        room.current_month++;

        // Обновляем в БД месяц
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

      // Устанавливаем каждому игроку состояние совершившего ход
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

      // Отправляем состония игроков всем в комнате
      sendGamers(io, db, room.room_id);

      // Находим все эффекты игроков для всех игроков данной комнаты
      let usersEffects = await db.UserInRoom.findAll({
        attributes: ["user_id", "effects"],
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

      // Отправляем каждому игроку его эффекты
      for (const userWithEffects of usersEffects) {
        io.sockets
          .to("user" + userWithEffects.user_id)
          .emit("setEffects", userWithEffects.effects);
        // Логируем исходящее событие
        logSocketOutEvent(
          `setEffects (user${userWithEffects.user_id})`,
          "Отправляем игроку его эффекты"
        );
      }

      // Рассылаем всем в комнате команду о следующем ходе
      io.in(socket.roomId).emit("doNextStep");
      // Логируем исходящее событие
      logSocketOutEvent(`doNextStep`, "Начинаем следующий ход");

      // Получаем массив с ID пользователей в комнате
      let participants = await db.UserInRoom.findAll({
        attributes: ["user_id"],
        where: {
          room_id: room.room_id
        }
      });
      let participantsArray = participants.map(el => {
        return el.user_id;
      });

      // Для каждого пользователя в комнате
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
        userInRoom.gamer_room_params.month--;
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

        await db.GamerRoomParams.update(
          {
            month: userInRoom.gamer_room_params.month
          },
          {
            where: {
              user_in_room_id: userInRoom.user_in_room_id
            }
          }
        );

        // Отправка новых данных состояния пользователю
        io.sockets.to("user" + gamerId).emit("SET_GAME_PARAMS", obj);
        // Логируем исходящее событие
        logSocketOutEvent(
          `SET_GAME_PARAMS (user${gamerId})`,
          "Начинаем следующий ход"
        );
      }
    } catch (error) {
      // Логируем ошибки
      logSocketError("manual_step_close", error);
    }
  });
};