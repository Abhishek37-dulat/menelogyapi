const mongoose = require("mongoose");

const ColorSchema = mongoose.Schema({
  colorname: {
    type: String,
    required: true,
  },
});

const Colors = mongoose.model("Colors", ColorSchema);

module.exports = Colors;
