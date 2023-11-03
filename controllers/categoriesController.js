const mongoose = require("mongoose");
const Categories = require("../models/Categories.js");

const getAllCategories = async (req, res, next) => {
  try {
    const alldata = await Categories.find({});
    return res
      .status(200)
      .json({ msg: "Get data successfully!", data: alldata });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "server side error in getallCategories", error: error });
  }
};

const getSingleCategories = async (req, res, next) => {
  try {
    const alldata = await Categories.findOne({ _id: req.params.id });
    if (!alldata) {
      return res.status(400).json({ msg: "Sorry not able to get anything" });
    }
    return res
      .status(200)
      .json({ msg: "Get data successfully!", data: alldata });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "server side error in getSingleCategories", error: error });
  }
};

const postCategories = async (req, res, next) => {
  try {
    const { name, subCategories } = req.body;
    if (!name) {
      return res.status(400).json({ msg: "name is required" });
    }
    const adddata = await Categories.create({
      name: name,
      subCategories: subCategories,
    });
    if (!adddata) {
      return res.status(400).json({ msg: "Sorry not able to add anything" });
    }
    return res
      .status(200)
      .json({ msg: "add data successfully!", data: adddata });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "server side error in postCategories", error: error });
  }
};

const ChangeCategories = async (req, res, next) => {
  try {
    const data = await Categories.findById(req.params.id);

    if (!data) {
      return res.status(400).json({ msg: "Cann't update Categorie data!" });
    }
    const { name, subCategories } = req.body;
    if (!name || !subCategories) {
      return res
        .status(400)
        .json({ msg: "Cann't update Categorie name or subCategories" });
    }
    const updatedData = await Categories.findByIdAndUpdate(
      { _id: data._id },
      {
        name: name,
        subCategories: subCategories,
      },
      { new: true }
    );
    await updatedData.save();
    return res
      .status(200)
      .json({ msg: "Categories Updated Successfully!", data: updatedData });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Server Side Error in ChangeCategorie!", error: error });
  }
};
const RemoveColor = async (req, res, next) => {
  try {
    const data = await Categories.findById(req.params.id);

    if (!data) {
      return res.status(400).json({ msg: "not able to delete Categories!" });
    }
    const deletedData = await Categories.findOneAndRemove({ _id: data._id });
    return res
      .status(200)
      .json({ msg: "Categorie deleted Successfully!", data: deletedData });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Server Side Error in RemoveCategorie!", error: error });
  }
};

module.exports = {
  getAllCategories,
  getSingleCategories,
  postCategories,
  ChangeCategories,
  RemoveColor,
};
