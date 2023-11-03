const mongoose = require("mongoose");

const feedbackSchema = mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    productID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      require: true,
    },
    comment: {
      type: String,
      require: true,
    },
    title: {
      type: String,
      require: true,
    },
    rating: {
      type: Number,
    },
    image: [
      {
        type: Object,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", feedbackSchema);
module.exports = Comment;
