const {
  logSocketInEvent,
  logSocketOutEvent,
  logSocketState,
  logSocketError
} = require("../global_functions/logs");
const { sendAdminMessage } = require("../global_functions/messages");

module.exports = function(socket, io, db) {
  // Прикрепление пользователя к комнате
  socket.on("subscribeRoom", async roomId => {
    // Логируем входящее событие
    logSocketInEvent("subscribeRoom", "Прикрепление пользователя к комнате");

    try {
      // Подписываем пользователя к комнате
      socket.join(roomId, () => {
        socket.roomId = roomId;
        logSocketState(`join ${roomId}`, "Подписка на канал комнаты");
      });

      // Находим последнюю комнату пользователя
      let userLastRoomId = await db.User.findOne({
        where: {
          user_id: socket.decoded_token.id
        },
        attributes: ["last_room"]
      });

      let room;

      if (userLastRoomId) {
        let lastRoomId = userLastRoomId.last_room;
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
      }

      // Находим пользователя в комнате
      let usersInRoom = await db.UserInRoom.findAll({
        where: {
          room_id: room.room_id
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

      if (room && usersInRoom.length !== 0) {
        // Устанавливаем, что пользователь подключён к комнате
        await db.UserInRoom.update(
          {
            isdisconnected: false
          },
          {
            where: {
              room_id: room.room_id,
              user_id: socket.decoded_token.id
            }
          }
        );

        // Формируем объект пользователей для фронтенда
        let gamersObj = [];
        if (usersInRoom.length !== 0) {
          usersInRoom.forEach(el => {
            gamersObj.push({
              id: el.user.user_id,
              name: el.user.name
            });
          });
        }
        let gamerNamesObj = {
          gamers: gamersObj
        };

        // Отправляем всем в комнате состояние игроков
        io.in(room.room_id).emit("setGamers", gamerNamesObj);

        // Логирование исходящего события
        logSocketOutEvent(
          "setGamers",
          "Отправляем всей комнате состояние игроков"
        );
      }

      sendAdminMessage(
        io,
        roomId,
        `Пользователь ${JSON.stringify(
          socket.decoded_token.name
        )} подключён к комнате #${roomId}`
      );
    } catch (error) {
      logSocketError("subscribe_room", error);
    }
  });
};
