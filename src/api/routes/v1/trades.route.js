const express = require("express");

const controller = require("../../controller/trades.controller");
const router = express.Router();

router.route("/add").post(controller.addTrades);
router.route("/update").put(controller.updateTrades);
router.route("/delete").delete(controller.deleteTrades);
router.route("/fetch").get(controller.fetchTrades);

module.exports = router;