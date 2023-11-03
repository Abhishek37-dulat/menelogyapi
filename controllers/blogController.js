const Blog = require("../models/Blog.js");
const fs = require("fs");
const path = require("path");
const imagesDir = path.join(__dirname, "../uploads");
const cloudinary = require("../database/cloudinary.js");

const AllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({});

    if (!blogs) {
      return res
        .status(400)
        .json({ msg: "an error occured while fetching all data!" });
    }

    return res.status(200).json({
      msg: "All data fetch successfully!",
      data: blogs,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "server error fetching all data: ",
      error: error,
    });
  }
};

const SingleBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.id });

    if (!blog) {
      return res
        .status(400)
        .json({ msg: "an error occured while fetching data!" });
    }

    fs.readdir(imagesDir, (err, files) => {
      if (err) {
        console.log("Error reading images directory", err);
        return res.status(500).json({ message: "Server Error" });
      }

      return res
        .status(200)
        .json({ msg: "Data Import Successfully!", data: blog });
    });
  } catch (error) {
    return res.json({
      msg: "server error fetching data: ",
      error: error,
    });
  }
};

const StoreBlog = async (req, res, next) => {
  console.log(req.body);
  try {
    const {
      blog_title,
      blog_subtitle,
      blog_description,
      blog_categories,
      blog_phone_number,
      urltitle,
      blog_image,
    } = req.body;

    if (
      !blog_title ||
      !blog_subtitle ||
      !blog_description ||
      !blog_categories ||
      !urltitle ||
      blog_image.length <= 0
    ) {
      return res.status(400).json({
        msg: "Please fill all the required Filleds!",
      });
    }
    const uploadImages = [];
    if (blog_image.length > 0) {
      for (let x = 0; x < blog_image.length; x++) {
        let up = await cloudinary.uploader.upload(blog_image[x], {
          upload_preset: "productImages",
        });
        uploadImages.push(up);
      }
      const newBlog = await new Blog({
        blog_title,
        blog_subtitle,
        blog_description,
        blog_categories,
        blog_phone_number,
        blog_image: uploadImages,
        urltitle,
      });
      await newBlog.save();
      console.log(newBlog);
      res.status(200).json({ msg: "added Successfully!", data: newBlog });
    }
  } catch (error) {
    res.status(500).json({ msg: "error while adding data!", error: error });
  }
};

const UpdateBlog = async (req, res, next) => {
  console.log("Function called: ", req.body);
  try {
    const blog = await Blog.findOne({ _id: req.params.id });
    if (!blog) {
      return res.status(400).json({ msg: "product not found!" });
    }
    // const filePaths = await req.files.map((file) => file.filename);
    const { preImages } = await req.body;
    // let AllImages = [];
    const uploadImages = [];
    if (blog_image.length > 0 || preImages.length > 0) {
      for (let x = 0; x < blog_image.length; x++) {
        let up = await cloudinary.uploader.upload(blog_image[x], {
          upload_preset: "productImages",
        });
        uploadImages.push(up);
      }
      for (let x = 0; x < preImages.length; x++) {
        uploadImages.push(preImages[x]);
      }
      const {
        blog_title,
        blog_subtitle,
        blog_description,
        blog_categories,
        blog_phone_number,
      } = req.body;
      const UpdatedBlog = await Blog.findOneAndUpdate(
        { _id: blog._id },
        {
          blog_title,
          blog_subtitle,
          blog_phone_number,
          blog_description,
          blog_image: uploadImages,
          blog_categories,
        },
        { new: true }
      );
      return res
        .status(200)
        .json({ msg: "Updated Successfully!", data: UpdatedBlog });
    }
  } catch (error) {
    return res.status(500).json({
      msg: "server error Updating data: ",
      error: error,
    });
  }
};

const DeleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.id });
    if (!blog) {
      return res.status(400).json({ msg: "Not able to delete blog!" });
    }

    const deletedblog = await Blog.findOneAndRemove({ _id: blog._id });
    await deletedblog.blog_image?.map((data) => {
      const imagePath = path.join(imagesDir, data);
      fs.unlink(imagePath, (err, file) => {
        if (err) {
          console.log("err:", err);
        }
      });
    });
    return res
      .status(200)
      .json({ msg: "delete successfully!", data: deletedblog });
  } catch (error) {
    return res.json({
      msg: "server error deleting data: ",
      error: error,
    });
  }
};

module.exports = {
  AllBlogs,
  SingleBlog,
  StoreBlog,
  UpdateBlog,
  DeleteBlog,
};
