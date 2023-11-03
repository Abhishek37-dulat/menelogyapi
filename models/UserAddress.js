const mongoose = require("mongoose");

const UserAddressSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
  },
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
});

const UserAddress = mongoose.model("UserAddress", UserAddressSchema);

module.exports = UserAddress;
