const express = require("express");
const {
  adminRegister,
  adminLogin,
  refreshToken,
} = require("../controllers/adminController.js");

const adminRoute = express.Router();

adminRoute.post("/register", adminRegister);
adminRoute.post("/login", adminLogin);
adminRoute.post("/refresh-token", refreshToken);

module.exports = adminRoute;
