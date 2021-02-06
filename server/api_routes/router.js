const express = require("express");
const router = express.Router();
const notFound = require("./404");

function getRouter(io) {
  // Работа с авторизацией и регистрацией
  router.use("/auth", require("./auth/auth"));

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

  router.use("*", notFound);

  return router;
}

module.exports = getRouter;
