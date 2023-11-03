const express = require("express");
const {
  AddContact,
  UpdateContact,
  DeleteContact,
  ShowContact,
  SingleContact,
} = require("../controllers/contactUsController.js");
const adminauthenticate = require("../middleware/adminauthmiddleware.js");

contactRoute = express.Router();

contactRoute.get("/contact", ShowContact);
contactRoute.get("/contact/:id", SingleContact);
contactRoute.post("/contact", adminauthenticate, AddContact);
contactRoute.put("/contact/:id", adminauthenticate, UpdateContact);
contactRoute.delete("/contact/:id", adminauthenticate, DeleteContact);

module.exports = contactRoute;
