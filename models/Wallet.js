const mongoose = require("mongoose");

const WalletSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    payment_status: {
      type: String,
      require: true,
    },
    amount: {
      type: Number,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const Wallet = mongoose.model("Wallet", WalletSchema);

module.exports = Wallet;
