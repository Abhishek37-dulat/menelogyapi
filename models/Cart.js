const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
  },
  color: {
    type: String,
    require: true,
  },
  size: {
    type: String,
    require: true,
  },
  density: {
    type: String,
    require: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
  },
  total_count: {
    type: Number,
    require: true,
  },
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
