const express = require("express");
const {
  GetAllUserAddress,
  AddUserAddress,
  UpdateUserAddress,
  DeleteUserAddress,
  GetUserAddress,
} = require("../controllers/userAddressController.js");
const authenticate = require("../middleware/authmiddleware.js");
const adminauthenticate = require("../middleware/adminauthmiddleware.js");

const userAddressRoute = express.Router();

userAddressRoute.get("/:id", adminauthenticate, GetUserAddress);
userAddressRoute.get("/", authenticate, GetAllUserAddress);
userAddressRoute.post("/", authenticate, AddUserAddress);
userAddressRoute.put("/:id", authenticate, UpdateUserAddress);
userAddressRoute.delete("/:id", authenticate, DeleteUserAddress);

module.exports = userAddressRoute;
