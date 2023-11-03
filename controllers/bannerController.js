const Banner = require("../models/Banner.js");
const cloudinary = require("../database/cloudinary.js");
// const uploadImage = require("../uploadImage.js");

const GetAllBanner = async (req, res, next) => {
  try {
    const data = await Banner.find({});

    return res
      .status(200)
      .json({ msg: "GetBannerData Successfully!", data: data });
  } catch (error) {
    return res.status(500).json({ msg: "GetBannerData Error!", error });
  }
};
const DeleteBanner = async (req, res, next) => {
  try {
    const data = await Banner.findById(req.params.id);
    if (!data) {
      return res.status(400).json({ msg: "Banner doesn't exist!" });
    }

    await Banner.findOneAndRemove({ _id: req.params.id });
    return res
      .status(200)
      .json({ msg: "Success to Delete Banner!", data: data });
  } catch (error) {
    return res.status(500).json({ msg: "DeleteBannerData Error!", error });
  }
};
const AddNewBanner = async (req, res, next) => {
  try {
    let tempImage = "";
    // uploadImage(req.body.image)
    //   .then(async (url) => {
    //     const data = await new Banner({
    //       banner_image: url,
    //       title: req.body.title,
    //       description: req.body.description,
    //       categories: req.body.categories,
    //     });
    //     await data.save();
    //     console.log(data);
    //     return res
    //       .status(200)
    //       .json({ msg: "PostBannerData Successfully!", data: data });
    //     // res.send(url);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     res.status(500).send(err);
    //   });
    const uploadImages = [];

    let up = await cloudinary.uploader.upload(req.body.image, {
      upload_preset: "productImages",
    });
    uploadImages.push(up);

    const data = await new Banner({
      banner_image: uploadImages,
      title: req.body.title,
      description: req.body.description,
      categories: req.body.categories,
    });
    await data.save();
    return res
      .status(200)
      .json({ msg: "PostBannerData Successfully!", data: data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "PostBannerData Error!", error });
  }
};

module.exports = {
  GetAllBanner,
  DeleteBanner,
  AddNewBanner,
};
