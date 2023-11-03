const express = require("express");
const {
  getAllCategories,
  getSingleCategories,
  postCategories,
  ChangeCategories,
  RemoveColor,
} = require("../controllers/categoriesController.js");
const CatRoutes = express.Router();

CatRoutes.get("/", getAllCategories);
CatRoutes.get("/:id", getSingleCategories);
CatRoutes.post("/", postCategories);
CatRoutes.put("/:id", ChangeCategories);
CatRoutes.delete("/:id", RemoveColor);

module.exports = CatRoutes;
