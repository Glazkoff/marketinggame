const express = require("express");
const router = express.Router();
const notFound = require("./404");

// Работа с админпанелью
router.use("/admin", require("./admin/admin"));

// Работа с отзывами
router.use("/reviews", require("./reviews/reviews"));

router.use("*", notFound);

module.exports = router;
