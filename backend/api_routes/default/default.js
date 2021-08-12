const express = require("express");
const router = express.Router();
const { logRestApiError } = require("../../global_functions/logs");

const DEFAULTROOMS = require("../../defaultrooms");

// Получить комнату по умолчанию
router.get("/room", (req, res) => {
  try {
    res.send(DEFAULTROOMS[0]);
  } catch (error) {
    logRestApiError("default", error);
    res.status(500).send({
      status: 500,
      message: "Ошибка отправки комнаты по умолчанию!"
    });
  }
});

module.exports = router;
