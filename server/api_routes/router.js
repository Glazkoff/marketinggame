const express = require("express");
const router = express.Router();
const notFound = require("./404");

function getRouter(io) {
  // Работа с авторизацией и регистрацией
  router.use("/auth", require("./auth/auth"));

  // Работа с отзывами
  router.use("/personal", require("./personal/personal")(io));

  // Работа с админпанелью
  router.use("/admin", require("./admin/admin"));

  // Работа с отзывами
  router.use("/reviews", require("./reviews/reviews"));

  // Работа с карточками
  router.use("/cards", require("./cards/cards"));

  // Работа с комнатами
  router.use("/rooms", require("./rooms/rooms")(io));

  // Работа со значениями по умолчанию
  router.use("/default", require("./default/default"));

  // Работа с информацией об обновлениях
  router.use("/updates", require("./updates/updates"));

  // Работа с подписками
  router.use("/payment", require("./payment/payment"));
  
  router.use("/users", require("./users/users"));

  router.use("*", notFound);

  return router;
}

module.exports = getRouter;
