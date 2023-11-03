const { instance } = require("../middleware/razorpaymiddleware.js");
const Payment = require("../models/Payment.js");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();

const CheckOut = async (req, res, next) => {
  const options = {
    amount: Number(req.body.amount * 100),
    currency: "INR",
  };
  const order = await instance.orders.create(options);

  res.status(200).json({
    success: true,
    order,
  });
};

const PaymentVerification = async (req, res, next) => {
  console.log("Function called:::::::::::::::::");
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Database comes here

    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    return res.redirect(
      `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
    );
  } else {
    console.log("sadasdasdasda");
    return res.redirect(`http://localhost:3000/paymentfailed`);
  }
};

module.exports = { CheckOut, PaymentVerification };
