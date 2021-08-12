const {
  logSocketInEvent,
  logSocketError
} = require("../global_functions/logs");
const { sendGamers } = require("../global_functions/game_process");

module.exports = function(socket, io, db) {
  socket.on("roomLeave", async roomId => {
    // Логируем входящее событие
    logSocketInEvent("roomLeave", "Удалить пользователя из комнаты");

    try {
      // #region Обнуление last room пользователя при ручном выходе из комнаты
      await db.User.update(
        {
          last_room: null
        },
        {
          where: {
            user_id: socket.decoded_token.id
          }
        }
      );
      // #endregion

      // Устанавливаем, что пользователь подключён к комнате
      await db.UserInRoom.update(
        {
          isdisconnected: true
        },
        {
          where: {
            room_id: roomId,
            user_id: socket.decoded_token.id
          }
        }
      );

      // Отправляем состояние игроков всем в комнате
      await sendGamers(io, db, roomId);
    } catch (error) {
      logSocketError("room_leave", error);
    }
  });
};
