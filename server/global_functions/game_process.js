const { logSocketOutEvent, logSocketError, logCommonError } = require("./logs");
const db = require("../models/index");

module.exports = {
  // Отправить состояния игроков в комнату
  async sendGamers(io, db, roomId) {
    try {
      if (roomId !== null && roomId !== undefined) {
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
  async getOneOffCardsId(Cards) {
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
  }
};
