const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => {
  res.send({ example: "test" });
});

router.use("/events", require("./events/events"));
// router.use("/cards", require("./cards/cards"));
// router.use("/users", require("./users/users"));
// router.use("/config", require("./config/config"));
// router.use("/rooms", require("./rooms/rooms"));

module.exports = router;
