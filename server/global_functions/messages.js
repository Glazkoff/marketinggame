const { logSocketOutEvent } = require("./logs");

module.exports = {
  sendAdminMessage(io, destination, text) {
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
  }
};
