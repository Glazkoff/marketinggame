const express = require("express");
const router = express.Router();

router.use("/admin", require("./admin/admin"));

router.use("*", function(req, res, next) {
  res.status(404).send({ err: "Path" + req.originalUrl + " does not exist" });
});

module.exports = router;
