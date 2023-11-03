const mongoose = require("mongoose");

const PaymentSchema = mongoose.Schema({
  razorpay_payment_id: {
    type: String,
    require: true,
  },
  razorpay_signature: {
    type: String,
    require: true,
  },
  razorpay_order_id: {
    type: String,
    require: true,
  },
});

const Payment = mongoose.model("Payment", PaymentSchema);

module.exports = Payment;
