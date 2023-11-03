const mongoose = require("mongoose");

const subCategoriesSchema = mongoose.Schema({
  name: {
    type: String,
  },
});

const categoriesSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  subCategories: [subCategoriesSchema],
});

const Categories = mongoose.model("Categories", categoriesSchema);

module.exports = Categories;
