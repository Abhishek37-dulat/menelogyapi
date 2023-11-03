const express = require("express");
const {
  AllProducts,
  SingleProduct,
  StoreProduct,
  UpdateProduct,
  DeleteProduct,
} = require("../controllers/productController.js");
const authenticate = require("../middleware/authmiddleware.js");
const adminauthenticate = require("../middleware/adminauthmiddleware.js");
const { upload } = require("../middleware/imagemiddleware.js");
const uploads = require("multer")();

productRoute = express.Router();

productRoute.get("/products", AllProducts);
productRoute.get("/products/:id", SingleProduct);
productRoute.get("/admin/products", adminauthenticate, AllProducts);
productRoute.get("/admin/products/:id", adminauthenticate, SingleProduct);
productRoute.post("/admin/products", adminauthenticate, StoreProduct);
// upload.array("images", 5),
productRoute.put("/admin/products/:id", adminauthenticate, UpdateProduct);
productRoute.delete("/admin/products/:id", adminauthenticate, DeleteProduct);

module.exports = productRoute;
