const express = require("express");
const adminauthenticate = require("../middleware/adminauthmiddleware.js");
const {
  GetAllColors,
  SingleColor,
  SendColor,
  ChangeColor,
  RemoveColor,
} = require("../controllers/colorController.js");

const ColorRoute = express.Router();

ColorRoute.get("/", adminauthenticate, GetAllColors);
ColorRoute.get("/:id", adminauthenticate, SingleColor);
ColorRoute.post("/", SendColor);
ColorRoute.put("/:id", adminauthenticate, ChangeColor);
ColorRoute.delete("/:id", adminauthenticate, RemoveColor);

module.exports = ColorRoute;
