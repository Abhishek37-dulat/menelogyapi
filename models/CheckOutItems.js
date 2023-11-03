const mongoose = require("mongoose");

const checkOutSchema = mongoose.Schema(
  {
    items: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          require: true,
        },
        qty: {
          type: Number,
          require: true,
        },
      },
    ],
    delivery_address: {
      address: {
        type: String,
        require: true,
      },
      city: {
        type: String,
        require: true,
      },
      state: {
        type: String,
        require: true,
      },
      pin_code: {
        type: String,
        require: true,
      },
    },

    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    total_discount: {
      type: Number,
    },
    delivery_charge: {
      type: Number,
    },
    order_status: {
      type: String,
    },
    total_amount: {
      type: Number,
      require: true,
    },
    order_id: {
      type: String,
    },
    shipment_id: {
      type: String,
    },
    ShipStatus: {
      type: String,
    },
    paymentStatus: {
      type: String,
      require: true,
    },
    customerId: {
      type: String,
    },
    paymentIntentId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const CheckOut = mongoose.model("CheckOut", checkOutSchema);

module.exports = CheckOut;
