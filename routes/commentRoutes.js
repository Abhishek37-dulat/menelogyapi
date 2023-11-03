const express = require("express");
const {
  AddComment,
  ShowComment,
  DeleteComment,
  UpdateComment,
  UserComment,
} = require("../controllers/commentController.js");
const authenticate = require("../middleware/authmiddleware.js");
const adminauthenticate = require("../middleware/adminauthmiddleware.js");
const { upload } = require("../middleware/imagemiddleware.js");
const uploads = require("multer")();

commentRoute = express.Router();

commentRoute.post("/comments", ShowComment);
commentRoute.get("/comments/user", authenticate, UserComment);
commentRoute.post(
  "/comment",
  upload.array("image", 1),
  authenticate,
  AddComment
);
commentRoute.put(
  "/comment/:id",
  upload.array("image", 1),
  authenticate,
  UpdateComment
);
commentRoute.delete("/comment/:id", authenticate, DeleteComment);
commentRoute.get("/admin/comments", adminauthenticate, ShowComment);

module.exports = commentRoute;
