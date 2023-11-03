const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  categorie: {
    type: String,
    required: true,
  },
  FormData: {
    type: {},
  },
  post_image: [
    {
      type: Object,
    },
  ],
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
