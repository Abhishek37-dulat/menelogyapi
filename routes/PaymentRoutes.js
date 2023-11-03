const express = require("express");
const {
  CheckOut,
  PaymentVerification,
} = require("../controllers/paymentController.js");
const router = express.Router();

router.post("/checkout", CheckOut);
router.post("/paymentverification", PaymentVerification);

module.exports = router;
