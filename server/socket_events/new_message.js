const {
  logSocketInEvent,
  logSocketOutEvent,
  logSocketError
} = require("../global_functions/logs");

module.exports = function(socket, io) {
  // При отправке игроком сообщения
  socket.on("newMessage", message => {
    // Логируем входящее событие
    logSocketInEvent("newMessage", "Отправка сообщения пользователя");

    try {
      // Отправляем всем пользователям в комнате
      socket.broadcast.to(socket.roomId).emit("addMessage", {
        name: socket.decoded_token.name,
        text: `${message}`
      });

      // Логируем исходящее событие
      logSocketOutEvent(
        "addMessage",
        "Рассылка сообщений всем пользователям в комнате"
      );
    } catch (error) {
      logSocketError("new_message", error);
    }
  });
};
