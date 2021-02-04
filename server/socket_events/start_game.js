const {
  logSocketInEvent,
  logSocketOutEvent
} = require("../global_functions/logs");
const { sendGamers } = require("../global_functions/game_process");

module.exports = function(socket, io, db) {
  // При старте игры в комнате
  socket.on("startGame", async function(data) {
    // Логирование входящего запроса
    logSocketInEvent("startGame", "При старте игры в комнате");

    try {
      // Пробуем найти комнату
      let room = await db.Room.findOne({
        where: {
          room_id: data.room_id
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

      // Если комната существует
      if (room) {
        // Устанавливаем в БД, что игра в комнате началась
        await db.Room.update(
          {
            is_start: false
          },
          {
            where: {
              room_id: data.room_id
            }
          }
        );
      }

      // Отправляем всем в комнате, что игра в комнате началась
      io.in(data.room_id).emit("SET_GAME_START", false);

      // Логируем исходящее событие
      logSocketOutEvent(
        "SET_GAME_START (false)",
        "Отправляем комнате - игра в комнате началась"
      );

      // Отправляем всем в комнате состояние игроков
      await sendGamers(io, db, data.room_id);
    } catch (error) {
      console.log(error);
    }
  });
};
