const mongoose = require("mongoose");

const bannerSchema = mongoose.Schema({
  banner_image: [
    {
      type: Object,
      required: true,
    },
  ],
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  categories: {
    type: [],
    required: true,
  },
});

const Banner = mongoose.model("Banner", bannerSchema);

module.exports = Banner;
