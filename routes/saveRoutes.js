const express = require("express");
const {
  GetAllSavedItem,
  UserAllSavedItem,
  DeleteSavedItem,
  AddSavedItem,
} = require("../controllers/saveController.js");
const authenticate = require("../middleware/authmiddleware.js");
const adminauthenticate = require("../middleware/adminauthmiddleware.js");
const saveRoute = express.Router();

saveRoute.get("/admin/save", adminauthenticate, GetAllSavedItem);
saveRoute.get("/save", authenticate, UserAllSavedItem);
saveRoute.post("/save", authenticate, AddSavedItem);
saveRoute.delete("/save/:id", authenticate, DeleteSavedItem);

module.exports = saveRoute;
