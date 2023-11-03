const express = require("express");
const {
  GetAllPost,
  DeletePost,
  AddNewPost,
} = require("../controllers/postController.js");
const adminauthenticate = require("../middleware/adminauthmiddleware.js");
const postRoute = express.Router();
const { upload } = require("../middleware/imagemiddleware.js");
const uploads = require("multer")();

postRoute.get("/", GetAllPost);
postRoute.post(
  "/",
  upload.array("post_image", 1),
  adminauthenticate,
  AddNewPost
);
postRoute.delete("/:id", adminauthenticate, DeletePost);

module.exports = postRoute;
