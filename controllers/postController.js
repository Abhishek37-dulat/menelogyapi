const Post = require("../models/Post.js");
const cloudinary = require("../database/cloudinary.js");

const GetAllPost = async (req, res, next) => {
  try {
    const data = await Post.find({});

    return res
      .status(200)
      .json({ msg: "GetPostData Successfully!", data: data });
  } catch (error) {
    return res.status(500).json({ msg: "GetPostData Error!", error });
  }
};
const DeletePost = async (req, res, next) => {
  try {
    const data = await Post.findById(req.params.id);
    if (!data) {
      return res.status(400).json({ msg: "Post doesn't exist!" });
    }

    await Post.findOneAndRemove({ _id: req.params.id });
    return res.status(200).json({ msg: "Success to Delete Post!", data: data });
  } catch (error) {
    return res.status(500).json({ msg: "DeletePostData Error!", error });
  }
};
const AddNewPost = async (req, res, next) => {
  console.log(req.body);
  try {
    const { title, description, categorie, location } = req.body;
    if (req.body.image) {
      const uploadImages = [];
      let up = await cloudinary.uploader.upload(req.body.image, {
        upload_preset: "productImages",
      });
      uploadImages.push(up);

      const data = await new Post({
        title,
        description,
        categorie,
        location,
        post_image: uploadImages,
      });
      await data.save();
      console.log(data);
      return res
        .status(200)
        .json({ msg: "PostBannerData Successfully!", data: data });
    } else {
      const data = await new Post({
        title,
        description,
        categorie,
        location,
      });
      await data.save();
      console.log(data);
      return res
        .status(200)
        .json({ msg: "PostBannerData Successfully!", data: data });
    }
  } catch (error) {
    return res.status(500).json({ msg: "PostBannerData Error!", error });
  }
};

module.exports = {
  GetAllPost,
  DeletePost,
  AddNewPost,
};
