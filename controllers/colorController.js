const Colors = require("../models/Colors.js");

const GetAllColors = async (req, res, next) => {
  try {
    const data = await Colors.find({});
    res.status(200).json({ msg: "Fetching data Successfull!", data: data });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Server Side Error in GetAllColors!", error: error });
  }
};
const SingleColor = async (req, res, next) => {
  try {
    const data = await Colors.findById(req.params.id);
    if (!data) {
      return res.status(400).json({ msg: "Color doesn't Exist!" });
    }
    res.status(200).json({ msg: "Single Color Data!", data: data });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Server Side Error in SingleColors!", error: error });
  }
};
const SendColor = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ msg: "Color name is Required!" });
    }
    const data = await new Colors({
      colorname: name,
    });
    await data.save();
    return res
      .status(200)
      .json({ msg: "Color Saved Successfully!", data: data });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Server Side Error in SendColors!", error: error });
  }
};
const ChangeColor = async (req, res, next) => {
  try {
    const { name, id } = req.body;
    if (!name || !id) {
      return res
        .status(400)
        .send({ msg: "conn't update without all required data!" });
    }
    const data = await Colors.findById(id);
    if (!data) {
      return res.status(400).json({ msg: "Cann't update Color data!" });
    }
    const updatedData = await Colors.findByIdAndUpdate(
      { _id: data._id },
      {
        colorname: name,
      },
      { new: true }
    );
    await updatedData.save();
    return res
      .status(200)
      .json({ msg: "Color Updated Successfully!", data: updatedData });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Server Side Error in ChangeColors!", error: error });
  }
};
const RemoveColor = async (req, res, next) => {
  try {
    const data = await Colors.findById(req.params.id);

    if (!data) {
      return res.status(400).json({ msg: "not able to delete Color!" });
    }
    const deletedData = await Colors.findOneAndRemove({ _id: data._id });
    return res
      .status(200)
      .json({ msg: "Color deleted Successfully!", data: deletedData });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Server Side Error in RemoveColors!", error: error });
  }
};

module.exports = {
  GetAllColors,
  SingleColor,
  SendColor,
  ChangeColor,
  RemoveColor,
};
