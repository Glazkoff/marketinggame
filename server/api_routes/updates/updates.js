const express = require("express");
const router = express.Router();
const db = require("../../models/index");
const { logRestApiError } = require("../../global_functions/logs");

// Получение полного списка инфорции об обновлениях
router.get("/", async (req, res) => {
  try {
    let updates = await db.Update.findAll();
    res.send(updates);
  } catch (error) {
    logRestApiError("updates", error);
  }
});

// Создание нового обновления
router.post("/", async (req, res) => {
  try {
    let updates = await db.Update.create({
      version_major: req.body.version_major,
      version_minor: req.body.version_minor,
      version_patch: req.body.version_patch,
      content: req.body.content
    });
    res.send(updates);
  } catch (error) {
    logRestApiError("updates", error);
  }
});

module.exports = router;
