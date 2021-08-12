const {
  logSocketInEvent,
  logSocketOutEvent,
  logSocketError
} = require("../global_functions/logs");

module.exports = function(socket, io) {
  // Рассылка нового тоста
  socket.on("addToast", toast => {
    // Логируем входящее событие
    logSocketInEvent("addToast", "Получение нового тоста");

    try {
      io.emit("setToast", toast);

      // Логируем исходящее событие
      logSocketOutEvent(
        "setToast",
        "Рассылка тоста всем пользователям в системе"
      );
    } catch (error) {
      logSocketError("add_toast", error);
    }
  });
};
