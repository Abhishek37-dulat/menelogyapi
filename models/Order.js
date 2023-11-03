const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
  order_id: {
    type: String,
    required: true,
  },
  order_date: {
    type: Date.now(),
    required: true,
  },
  pickup_location: {
    type: String,
    required: true,
  },
  channel_id: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
  },
  billing_customer_name: {
    type: String,
    required: true,
  },
  billing_last_name: {
    type: String,
  },
  billing_address: {
    type: String,
  },
  billing_address_2: {
    type: String,
  },
  billing_city: {
    type: String,
    required: true,
  },
  billing_pincode: {
    type: Number,
    required: true,
  },
  billing_state: {
    type: String,
    required: true,
  },
  billing_country: {
    type: String,
    required: true,
  },
  billing_email: {
    type: String,
    required: true,
  },
  billing_phone: {
    type: String,
    required: true,
  },
  shipping_is_billing: {
    type: String,
    required: true,
  },
  shipping_customer_name: {
    type: String,
  },
  shipping_last_name: {
    type: String,
  },
  shipping_address: {
    type: String,
  },
  shipping_address_2: {
    type: String,
  },
  shipping_city: {
    type: String,
  },
  shipping_pincode: {
    type: String,
  },
  shipping_country: {
    type: String,
  },
  shipping_state: {
    type: String,
  },
  shipping_email: {
    type: String,
  },
  shipping_phone: {
    type: String,
  },
  order_items: [
    {
      name: {
        type: String,
        required: true,
      },
      sku: {
        type: String,
        required: true,
      },
      units: {
        type: Number,
        required: true,
      },
      selling_price: {
        type: Number,
        required: true,
      },
      discount: {
        type: String,
      },
      tax: {
        type: String,
      },
      hsn: {
        type: String,
      },
    },
  ],
  payment_method: {
    type: String,
    required: true,
  },
  shipping_charges: {
    type: Number,
    required: true,
  },
  giftwrap_charges: {
    type: Number,
  },
  transaction_charges: {
    type: Number,
  },
  total_discount: {
    type: Number,
    required: true,
  },
  sub_total: {
    type: Number,
    required: true,
  },
  length: {
    type: Number,
    required: true,
  },
  breadth: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
});

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
