const mongoose = require("mongoose");

const shipTokenSchema = mongoose.Schema(
  {
    ship_id: {
      type: String,
      require: true,
    },
    first_name: {
      type: String,
      require: true,
    },
    last_name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    company_id: {
      type: String,
      require: true,
    },
    created_at: {
      type: String,
      require: true,
    },
    token: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const ShipToken = mongoose.model("ShipToken", shipTokenSchema);

module.exports = ShipToken;
