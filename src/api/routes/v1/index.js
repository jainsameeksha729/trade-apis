const express = require('express');
const trades = require("./trades.route");
const userPortfolio = require("./userPortfolio.route")
const users = require("./users.route")
const router = express.Router();


router.get('/status', (req, res) => res.send('OK'));

router.use("/trades", trades);
router.use("/portfolio", userPortfolio);
router.use("/user", users);

module.exports = router;
