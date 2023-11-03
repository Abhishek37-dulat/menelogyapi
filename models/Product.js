const { boolean } = require("joi");
const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
  product_title: {
    type: String,
    required: true,
  },
  product_qty: {
    type: Number,
    required: true,
  },
  product_tagline: {
    type: String,
    required: true,
  },
  product_description: {
    type: String,
    required: true,
  },
  product_image: [
    {
      type: Object,
      required: true,
    },
  ],
  product_color_tags: {
    type: [],
  },
  product_hair_length: [
    {
      type: String,
      required: true,
    },
  ],

  product_customization_price: {
    type: Number,
  },
  product_size_tags: [
    {
      size: {
        type: String,
      },
      type: {
        type: String,
      },
    },
  ],
  product_categories: {
    type: [],
    required: true,
  },
  product_price: {
    type: Number,
    required: true,
  },
  product_gender: {
    type: String,
    required: true,
  },
  product_video: {
    type: String,
  },
  product_density: {
    type: Boolean,
    required: true,
    default: false,
  },
  product_steps: [
    {
      title: {
        type: String,
      },
      description: {
        type: String,
      },
      link: {
        type: String,
      },
    },
  ],
  product_discount: {
    type: Number,
  },
  product_length: {
    type: Number,
    required: true,
  },
  product_breadth: {
    type: Number,
    required: true,
  },
  product_height: {
    type: Number,
    required: true,
  },
  product_weight: {
    type: Number,
    required: true,
  },
  product_company_name: {
    type: String,
  },
  product_company_location: {
    type: String,
  },
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
