const mongoose = require("mongoose");

const BlogSchema = mongoose.Schema({
  blog_title: {
    type: String,
    required: true,
  },
  blog_subtitle: {
    type: String,
    required: true,
  },
  blog_description: {
    type: String,
    required: true,
  },
  urltitle: {
    type: String,
    required: true,
  },
  blog_image: [
    {
      type: Object,
      required: true,
    },
  ],
  blog_categories: {
    type: [],
    required: true,
  },
  blog_phone_number: {
    type: String,
  },
});

const Blog = mongoose.model("Blog", BlogSchema);

module.exports = Blog;
