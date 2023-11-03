const express = require("express");
const {
  GetAllCartItem,
  GetAllCartItems,
  GetCartItem,
  AddCartItem,
  DeleteCartItem,
  UpdateCartItem,
} = require("../controllers/cartController.js");
const authenticate = require("../middleware/authmiddleware.js");
const adminauthenticate = require("../middleware/adminauthmiddleware.js");
const cartRoute = express.Router();

cartRoute.get("/cart", authenticate, GetAllCartItem);
cartRoute.get("/cart/:id", authenticate, GetCartItem);
cartRoute.get("/admin/cart", adminauthenticate, GetAllCartItems);
cartRoute.post("/cart", authenticate, AddCartItem);
cartRoute.put("/cart/:id", authenticate, UpdateCartItem);
cartRoute.delete("/cart/:id", authenticate, DeleteCartItem);

module.exports = cartRoute;
