const {
  logSocketInEvent,
  logSocketOutEvent,
  logSocketError
} = require("../global_functions/logs");
const {isCurrentStepFinished} = require("../global_functions/game_process");
const Sequelize = require("sequelize");

module.exports = function (socket, io, db) {
  // Удалить пользователя из комнаты
  socket.on("kickUser", async data => {
    // Логируем входящее событие
    logSocketInEvent("kickUser", "Удалить пользователя из комнаты");

    try {
      // Отправляем событие пользователю, которого мы хотим выкинуть
      io.in("user" + data.gamerId).emit("kickUser");
      // Логируем исходящее событие
      logSocketOutEvent("kickUser", "Сообщаем пользователю, что его выкинули");

      // Находим информацию о комнате
      let room = await db.Room.findOne({
        where: {
          room_id: data.roomId
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

      // Удаление информации о последней комнаты у пользователя
      await db.User.update(
        {
          last_room: null
        },
        {
          where: {
            user_id: data.gamerId
          }
        }
      );

      // Отключаем пользователя от комнаты
      await db.UserInRoom.update(
        {
          isdisconnected: true
        },
        {
          where: {
            room_id: room.room_id,
            user_id: data.gamerId
          }
        }
      );

      // Добавляем пользователя в массив кикнутых игроков
      if (room.kicked_participants_id !== null) {
        room.kicked_participants_id.push(data.gamerId);
      } else {
        room.kicked_participants_id = [data.gamerId];
      }
      await db.Room.update(
        {
          kicked_participants_id: room.kicked_participants_id
        },
        {
          where: {
            room_id: data.roomId
          }
        }
      );

      // Если кикнутый участник был последним для завершения хода
      if ((await isCurrentStepFinished(io, db, room)).finished) {
        // Если текущий месяц не больше максимального количества месяцев
        if (room.first_params.month > room.current_month) {
          await db.Room.update(
            {
              current_month: Sequelize.literal("current_month + 1")
            },
            {
              where: {
                room_id: room.room_id
              }
            }
          )
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
        io.in(socket.roomId).emit("doNextStep");
        // Логируем исходящее событие
        logSocketOutEvent(`doNextStep`, "Начинаем следующий ход");
      }

    } catch (error) {
      // Логируем ошибки
      logSocketError("kick_user", error);
    }
  });
};
