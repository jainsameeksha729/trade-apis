const express = require("express");

const controller = require("../../controller/users.controller");
const router = express.Router();

router.route("/getDetails").get(controller.getDetail);
router.route("/add").post(controller.addUser);

module.exports = router;