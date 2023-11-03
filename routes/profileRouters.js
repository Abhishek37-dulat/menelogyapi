const express = require("express");
const {
  GetProfileData,
  AddProfileData,
  UpdateProfileData,
  GetProfileDataAdmin,
  GetAllProfileDataAdmin,
} = require("../controllers/profileController.js");
const profileRouter = express.Router();
const authenticate = require("../middleware/authmiddleware.js");
const { upload } = require("../middleware/imagemiddleware.js");
const adminauthenticate = require("../middleware/adminauthmiddleware.js");
const uploads = require("multer")();

profileRouter.get("/", authenticate, GetProfileData);
profileRouter.get("/:id", adminauthenticate, GetProfileDataAdmin);
profileRouter.get("/data/user", adminauthenticate, GetAllProfileDataAdmin);
profileRouter.post("/", upload.array("image", 1), authenticate, AddProfileData);
profileRouter.put(
  "/:id",
  upload.array("image", 1),
  authenticate,
  UpdateProfileData
);

module.exports = profileRouter;
