const mongoose = require("mongoose");

const saveSchema = mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    require: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
});

const Save = mongoose.model("Save", saveSchema);

module.exports = Save;
