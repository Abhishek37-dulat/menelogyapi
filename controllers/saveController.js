const Save = require("../models/Save.js");

const GetAllSavedItem = async (req, res, next) => {
  try {
    const allsave = await Save.find({});
    return res
      .status(200)
      .json({ msg: "Success to all save item!", data: allsave });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "server error get all Save Item!", error: error });
  }
};

const UserAllSavedItem = async (req, res, next) => {
  try {
    const allsave = await Save.find({ userID: req.user.userExits._id });

    if (!allsave) {
      return res.status(400).json({ msg: "no saved item!" });
    }
    return res
      .status(200)
      .json({ msg: "Success to one save item!", data: allsave });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "server error get one Save Item!", error: error });
  }
};

const AddSavedItem = async (req, res, next) => {
  try {
    const { product_id } = req.body;
    if (!product_id) {
      return res.status(400).json({ msg: "all filled required" });
    }
    const addsaved = await new Save({
      userID: req.user.userExits._id,
      product_id: product_id,
    });
    console.log(addsaved);
    await addsaved.save();
    return res.status(200).json({ msg: "added successfully!", data: addsaved });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "server error add one Save Item!", error: error });
  }
};

const DeleteSavedItem = async (req, res, next) => {
  try {
    const allsave = await Save.findOne({ _id: req.params.id });
    if (!allsave) {
      return res.status(400).json({ msg: "doesn't exist saved item!" });
    }
    if (req.user.userExits._id != allsave.userID) {
      return res.status(400).json({ msg: "permission denied item!" });
    }

    await Save.findOneAndRemove({ _id: allsave._id });
    return res
      .status(200)
      .json({ msg: "Success to Delete save item!", data: allsave });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "server error delete all Save Item!", error: error });
  }
};

module.exports = {
  GetAllSavedItem,
  UserAllSavedItem,
  DeleteSavedItem,
  AddSavedItem,
};
