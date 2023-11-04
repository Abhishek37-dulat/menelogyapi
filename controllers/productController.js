const Product = require("../models/Product.js");
const fs = require("fs");
const path = require("path");
const cloudinary = require("../database/cloudinary.js");
const imagesDir = path.join(__dirname, "../uploads");

const AllProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});

    if (!products) {
      return res
        .status(400)
        .json({ msg: "an error occured while fetching all data!" });
    }

    return res.status(200).json({
      msg: "All data fetch successfully!",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "server error fetching all data: ",
      error: error,
    });
  }
};

const SingleProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id });

    if (!product) {
      return res
        .status(400)
        .json({ msg: "an error occured while fetching data!" });
    }

    return res
      .status(200)
      .json({ msg: "Data Import Successfully!", data: product });
  } catch (error) {
    return res.json({
      msg: "server error fetching data: ",
      error: error,
    });
  }
};

const StoreProduct = async (req, res, next) => {
  console.log(req.body);
  try {
    console.log("h1");
    const {
      product_title,
      product_qty,
      product_tagline,
      product_description,
      product_color_tags,
      product_size_tags,
      product_categories,
      product_price,
      product_discount,
      product_length,
      product_breadth,
      product_height,
      product_weight,
      product_gender,
      product_video,
      product_steps,
      product_density,
      product_image,
      product_hair_length,
      product_customization_price,
    } = req.body;
    console.log("h2");
    if (
      !product_title ||
      !product_tagline ||
      !product_description ||
      !product_categories ||
      !product_price ||
      !product_qty ||
      product_image.length <= 0 ||
      product_length <= 0.5 ||
      product_breadth <= 0.5 ||
      product_height <= 0.5 ||
      product_weight <= 0
    ) {
      return res
        .status(400)
        .json({ msg: "Please fill all the required Filleds!" });
    }
    console.log("h3");
    const { company_name, company_location } = req.user.userExits;
    console.log("h4");
    const uploadImages = [];
    if (product_image.length > 0) {
      for (let x = 0; x < product_image.length; x++) {
        let up = await cloudinary.uploader.upload(product_image[x], {
          upload_preset: "productImages",
        });
        uploadImages.push(up);
      }
      if (uploadImages.length > 0) {
        console.log("hello");
        const newProduct = await new Product({
          product_title,
          product_qty,
          product_tagline,
          product_description,
          product_image: uploadImages,
          product_color_tags,
          product_size_tags,
          product_categories,
          product_price,
          product_discount,
          product_gender,
          product_video,
          product_steps,
          product_density,
          product_hair_length,
          product_customization_price,
          product_length: product_length,
          product_breadth: product_breadth,
          product_height: product_height,
          product_weight: product_weight,
          product_company_name: company_name,
          product_company_location: company_location,
        });
        await newProduct.save();
        console.log(newProduct);
        res.status(200).json({ msg: "added Successfully!", data: newProduct });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "error while adding data!", error: error });
  }
};

const UpdateProduct = async (req, res, next) => {
  console.log("Function called: ", req.body);
  try {
    const product = await Product.findOne({ _id: req.params.id });
    if (!product) {
      return res.status(400).json({ msg: "product not found!" });
    }

    const {
      product_title,
      product_qty,
      product_tagline,
      product_description,
      product_image,
      product_color_tags,
      product_size_tags,
      product_categories,
      product_gender,
      product_video,
      product_steps,
      product_density,
      product_price,
      product_discount,
      product_length,
      product_breadth,
      product_height,
      product_weight,
      preImages,
      product_hair_length,
      product_customization_price,
    } = req.body;
    const uploadImages = [];
    if (product_image.length > 0 || preImages.length > 0) {
      for (let x = 0; x < product_image.length; x++) {
        let up = await cloudinary.uploader.upload(product_image[x], {
          upload_preset: "productImages",
        });
        uploadImages.push(up);
      }
      if (uploadImages.length > 0 || preImages.length > 0) {
        if (preImages.length > 0) {
          for (let x = 0; x < preImages.length; x++) {
            uploadImages.push(preImages[x]);
          }
        }
        const UpdatedProduct = await Product.findOneAndUpdate(
          { _id: product._id },
          {
            product_title,
            product_qty,
            product_tagline,
            product_description,
            product_image: uploadImages,
            product_color_tags,
            product_size_tags,
            product_categories,
            product_price,
            product_discount,
            product_gender,
            product_video,
            product_steps,
            product_density,
            product_hair_length,
            product_customization_price,
            product_length: product_length,
            product_breadth: product_breadth,
            product_height: product_height,
            product_weight: product_weight,
          },
          { new: true }
        );
        console.log(UpdatedProduct);
        return res
          .status(200)
          .json({ msg: "Updated Successfully!", data: UpdatedProduct });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "server error Updating data: ",
      error: error,
    });
  }
};

const DeleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id });
    if (!product) {
      return res.status(400).json({ msg: "Not able to delete Product!" });
    }

    const deletedProduct = await Product.findOneAndRemove({ _id: product._id });

    return res
      .status(200)
      .json({ msg: "delete successfully!", data: deletedProduct });
  } catch (error) {
    return res.json({
      msg: "server error deleting data: ",
      error: error,
    });
  }
};

// const SingleImage = async (req, res, next) => {
//   try {
//     const product = await Product.findOne({ _id: req.params.id });

//     if (!product) {
//       return res
//         .status(400)
//         .json({ msg: "an error occured while fetching data!" });
//     }

//     fs.readdir(imagesDir, (err, files) => {
//       if (err) {
//         console.log("Error reading images directory", err);
//         return res.status(500).json({ message: "Server Error" });
//       }
//       const imagePaths = product.product_image.map((file) => `/images/${file}`);
//       product.product_image = imagePaths;
//       return res
//         .status(200)
//         .json({ msg: "Data Import Successfully!", data: product });
//     });
//   } catch (error) {
//     return res.json({
//       msg: "server error fetching data: ",
//       error: error,
//     });
//   }
// };

module.exports = {
  AllProducts,
  SingleProduct,
  StoreProduct,
  UpdateProduct,
  DeleteProduct,
};
