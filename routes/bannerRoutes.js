const express = require("express");
const {
  GetAllBanner,
  DeleteBanner,
  AddNewBanner,
} = require("../controllers/bannerController.js");
const adminauthenticate = require("../middleware/adminauthmiddleware.js");
const bannerRoute = express.Router();
// const { upload } = require("../middleware/imagemiddleware.js");
const uploads = require("multer");
const upload = uploads();

bannerRoute.get("/", GetAllBanner);
bannerRoute.post("/", adminauthenticate, AddNewBanner);
bannerRoute.delete("/:id", adminauthenticate, DeleteBanner);

module.exports = bannerRoute;
