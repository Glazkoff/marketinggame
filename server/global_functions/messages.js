const { logSocketOutEvent, logSocketError } = require("./logs");

module.exports = {
  // Сообщение от администратора
  sendAdminMessage(io, destination, text) {
    try {
      // Отправляем адресату или группе адресатов сообщение
      io.in(destination).emit("addMessage", {
        name: "Admin",
        text
      });

      // Логируем исходящее событие
      logSocketOutEvent(
        "addMessage (Admin)",
        "Отправка сообшения администратора"
      );
    } catch (error) {
      logSocketError("messages", error);
    }
  },

  // Сообщение "Отдела аналитики"
  sendAnalyticsMessage(io, destination, text) {
    try {
      // Отправляем адресату или группе адресатов сообщение
      io.in(destination).emit("addMessage", {
        name: "ОТДЕЛ АНАЛИТИКИ",
        text
      });

      // Логируем исходящее событие
      logSocketOutEvent(
        "addMessage (Analytics)",
        "Отправка сообшения администратора"
      );
    } catch (error) {
      logSocketError("messages", error);
    }
  },

  // Сообщение "Отдела аналитики"
  sendEventMessage(io, destination, text) {
    try {
      // Отправляем адресату или группе адресатов сообщение
      io.in(destination).emit("addMessage", {
        name: "СОБЫТИЕ!",
        text
      });

      // Логируем исходящее событие
      logSocketOutEvent("addMessage (Event)", "Отправка сообшения о событии");
    } catch (error) {
      logSocketError("messages", error);
    }
  }
};
