const express = require("express");

const controller = require("../../controller/userPortfolio.controller");
const router = express.Router();

router.route("/fetch").get(controller.fetchPortfolio);
router.route("/return").get(controller.fetchReturn);

module.exports = router;