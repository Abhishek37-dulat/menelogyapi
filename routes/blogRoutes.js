const express = require("express");
const {
  AllBlogs,
  SingleBlog,
  StoreBlog,
  UpdateBlog,
  DeleteBlog,
} = require("../controllers/blogController.js");
const authenticate = require("../middleware/authmiddleware.js");
const adminauthenticate = require("../middleware/adminauthmiddleware.js");
const { upload } = require("../middleware/imagemiddleware.js");
const uploads = require("multer")();

blogRoute = express.Router();

blogRoute.get("/blogs", AllBlogs);
blogRoute.get("/blogs/:id", SingleBlog);
blogRoute.get("/admin/blogs", adminauthenticate, AllBlogs);
blogRoute.get("/admin/blogs/:id", adminauthenticate, SingleBlog);
blogRoute.post(
  "/admin/blogs",
  upload.array("blog_image", 5),
  adminauthenticate,
  StoreBlog
);
blogRoute.put(
  "/admin/blogs/:id",
  upload.array("blog_image", 5),
  adminauthenticate,
  UpdateBlog
);
blogRoute.delete(
  "/admin/blogs/:id",
  upload.array("blog_image", 5),
  adminauthenticate,
  DeleteBlog
);

module.exports = blogRoute;
