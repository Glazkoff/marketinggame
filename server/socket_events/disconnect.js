const { logSocketState, logSocketError } = require("../global_functions/logs");
const { sendGamers } = require("../global_functions/game_process");

module.exports = function(socket, io, db) {
  socket.on("disconnect", async function() {
    // Логирование отключения
    logSocketState("disconnect", "Отключение пользователя");

    try {
      // Находим номер последней комнаты пользователя
      let user = await db.User.findOne({
        where: {
          user_id: socket.decoded_token.id
        },
        attributes: ["last_room"]
      });

      let room;

      if (user) {
        // Находим объект последней комнаты пользователя
        room = await db.Room.findOne({
          where: {
            room_id: user.last_room,
            is_finished: false
          },
          order: [["updatedAt", "DESC"]]
        });
      }

      // Отписка от канала пользователя
      socket.leave("user" + socket.decoded_token.id, () => {
        // Логирование состояния
        logSocketState(
          `leave (user${socket.decoded_token.id})`,
          "Отписка от канала пользователя"
        );
      });

      // Если комната существует
      if (room) {
        // Устанавливаем пользователю в комнате состояние "Отключён"
        await db.UserInRoom.update(
          { isdisconnected: true },
          {
            where: {
              room_id: room.room_id,
              user_id: socket.decoded_token.id
            }
          }
        );

        // Отписка от канала комнаты
        socket.leave(room.room_id, () => {
          // Логирование состояния
          logSocketState(
            `leave (${room.room_id})`,
            "Отписка от канала комнаты"
          );
        });

        // Отправляем состояние игроков всем в комнате
        await sendGamers(io, db, room.room_id);
      }
    } catch (error) {
      // Логируем ошибки
      logSocketError("disconnect", error);
    }
  });
};
