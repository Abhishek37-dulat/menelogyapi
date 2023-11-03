const express = require("express");
const {
  GetUserOrders,
  GetUserSingleOrder,
  NewOrder,
  UpdateOrder,
  GetUserOrdersAdmin,
  GetUserOrdersAdminSingle,
} = require("../controllers/userOrderController.js");
const authenticate = require("../middleware/authmiddleware.js");
const adminauthenticate = require("../middleware/adminauthmiddleware.js");

const UserCheckOutRoute = express.Router();

UserCheckOutRoute.get("/", authenticate, GetUserOrders);
UserCheckOutRoute.get("/admin", adminauthenticate, GetUserOrdersAdmin);
UserCheckOutRoute.get(
  "/admin/:id",
  adminauthenticate,
  GetUserOrdersAdminSingle
);
UserCheckOutRoute.get("/:id", authenticate, GetUserSingleOrder);
UserCheckOutRoute.post("/", authenticate, NewOrder);
UserCheckOutRoute.put("/:id", authenticate, UpdateOrder);

module.exports = UserCheckOutRoute;
