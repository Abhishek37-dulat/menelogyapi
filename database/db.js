const mongoose = require("mongoose");

const ConnectionDB = async (MONGODB_URL) => {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log("Connected to Database...");
  } catch (error) {
    console.log("Connecting to Database was BAD...!", error);
  }
};

module.exports = ConnectionDB;
