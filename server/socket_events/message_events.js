const {
  logSocketInEvent,
  logSocketOutEvent
} = require("../global_functions/logs");

module.exports = function(socket, io) {
  // При отправке игроком сообщения
  socket.on("newMessage", message => {
    // Логируем входящее событие
    logSocketInEvent("newMessage", "Отправка сообщения пользователя");

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
  });

  // Рассылка нового тоста
  socket.on("addToast", toast => {
    // Логируем входящее событие
    logSocketInEvent("addToast", "Получение нового тоста");

    io.emit("setToast", toast);

    // Логируем исходящее событие
    logSocketOutEvent(
      "setToast",
      "Рассылка тоста всем пользователям в системе"
    );
  });
};
