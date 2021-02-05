const express = require("express");
const router = express.Router();
const notFound = require("./404");

router.use("/admin", require("./admin/admin"));

router.use("*", notFound);

module.exports = router;
