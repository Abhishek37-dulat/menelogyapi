const express = require("express");
const { phonePe } = require("../controllers/phonepayPayment.js");
const router = express.Router();

router.post("/paymentverification", phonePe);

module.exports = router;
