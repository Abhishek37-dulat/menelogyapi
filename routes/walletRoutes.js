const express = require("express");
const { GetWallet } = require("../controllers/walletController.js");
const authenticate = require("../middleware/authmiddleware.js");

const walletRoute = express.Router();

walletRoute.get("/wallet", authenticate, GetWallet);

module.exports = walletRoute;
