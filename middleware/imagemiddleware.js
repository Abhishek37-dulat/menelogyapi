const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const app = express();

const imagesDir = path.join(__dirname, "../uploads");

// Configure multer to store uploaded images in a specific folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imagesDir);
  },
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = { upload };
