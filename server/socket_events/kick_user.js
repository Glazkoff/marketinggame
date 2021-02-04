const {
  logSocketInEvent,
  logSocketOutEvent,
  logSocketError
} = require("../global_functions/logs");

module.exports = function(socket, io, db) {
  // Удалить пользователя из комнаты
  socket.on("kickUser", async data => {
    // Логируем входящее событие
    logSocketInEvent("kickUser", "Удалить пользователя из комнаты");

    try {
      // Отправляем событие пользователю, которого мы хотим выкинуть
      io.in("user" + data.gamerId).emit("kickUser");

      // Логируем исходящее событие
      logSocketOutEvent("kickUser", "Сообщаем пользователю, что его выкинули");

      // #region Удаление комнаты как последней для пользователя которого кикнули
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
      // #endregion

      // #region Удаление пользователя из комнаты и его добавление в "черный список" (кик)
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

      // Устанавливаем, что пользователь подключён к комнате
      await db.UserInRoom.update(
        {
          isdisconnected: true
        },
        {
          where: {
            room_id: room.room_id,
            user_id: socket.decoded_token.id
          }
        }
      );

      // Добавляем кикнутого пользователя
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
      // #endregion
    } catch (error) {
      // Логируем ошибки
      logSocketError("kick_user", error);
    }
  });
};
