const { logSocketOutEvent } = require("./logs");

module.exports = {
  async sendGamers(io, db, roomId) {
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
        name: el.user.name
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
  }
};
