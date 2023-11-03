const express = require("express");
const {
  GetAllOrders,
  //   GetSingleOrder,
  //   NewOrder,

  verifyOrders,
} = require("../controllers/orderController.js");
const {
  UpdateOrder,
  AdminUpdateOrder,
  DeniedUpdateOrder,
} = require("../controllers/userOrderController.js");
const adminauthenticate = require("../middleware/adminauthmiddleware.js");
const authenticate = require("../middleware/authmiddleware.js");
const orderRoute = express.Router();

orderRoute.post("/order/varify", verifyOrders);
orderRoute.get("/orders", GetAllOrders);
orderRoute.put("/order/:id", authenticate, UpdateOrder);
orderRoute.put("/order/admin/:id", adminauthenticate, AdminUpdateOrder);
orderRoute.put("/order/admin/denied/:id", adminauthenticate, DeniedUpdateOrder);
// orderRoute.get("/order/:id", adminauthenticate, GetSingleOrder);
// orderRoute.post("/order", adminauthenticate, NewOrder);

module.exports = orderRoute;
