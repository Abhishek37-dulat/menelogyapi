const express = require("express");
const {
  GetSeoItem,
  UpdateSeoItem,
  AddSeoItem,
  GetSeoItemAll,
} = require("../controllers/seoController.js");
const adminauthenticate = require("../middleware/adminauthmiddleware.js");
const seoRoute = express.Router();

seoRoute.get("/:id", GetSeoItem);
seoRoute.get("/", GetSeoItemAll);
seoRoute.put("/:id", adminauthenticate, UpdateSeoItem);
seoRoute.post("/", adminauthenticate, AddSeoItem);

module.exports = seoRoute;
