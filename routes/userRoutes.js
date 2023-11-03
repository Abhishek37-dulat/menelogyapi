const express = require("express");
const {
  userRegister,
  userLogin,
  refreshToken,
  getAllUser,
  getSingleUser,
  addUserAddress,
  pullUserAddress,
  updateUserAddress,
  updateUserInformation,
} = require("../controllers/userController.js");
const adminauthenticate = require("../middleware/adminauthmiddleware.js");
const authenticate = require("../middleware/authmiddleware.js");

const userRoute = express.Router();

userRoute.post("/register", userRegister);
userRoute.post("/login", userLogin);
userRoute.post("/refresh-token", refreshToken);
userRoute.get("/", adminauthenticate, getAllUser);
userRoute.get("/:id", adminauthenticate, getSingleUser);

userRoute.post("/address", authenticate, addUserAddress);
userRoute.put("/address/remove/:id", authenticate, pullUserAddress);
userRoute.put("/address/update/:id", authenticate, updateUserAddress);
userRoute.put("/details/update", authenticate, updateUserInformation);
userRoute.get("/user/:id", authenticate, getSingleUser);

module.exports = userRoute;
