const UserAddress = require("../models/UserAddress.js");

const GetAllUserAddress = async (req, res, next) => {
  try {
    const data = await UserAddress.find({
      user_id: req.user.userExits._id,
    });
    if (!data) {
      return res.status(400).json({ msg: "no Address Exits!" });
    }
    return res
      .status(200)
      .json({ msg: "Success to all user Address!", data: data });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "server error get all user Address!", error: error });
  }
};

const GetUserAddress = async (req, res, next) => {
  try {
    const data = await UserAddress.find({ user_id: req.params.id });
    if (!data) {
      return res.status(400).json({ msg: "no Address Exits!" });
    }
    return res
      .status(200)
      .json({ msg: "Success to all user Address!", data: data });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "server error get all user Address!", error: error });
  }
};

const AddUserAddress = async (req, res, next) => {
  try {
    const { address, city, state, pin_code } = req.body;
    if (!address || !city || !state || !pin_code) {
      return res.status(400).json({ msg: "all filled required" });
    }
    const data = await new UserAddress({
      user_id: req.user.userExits._id,
      address: address,
      city: city,
      state: state,
      pin_code: pin_code,
    });
    await data.save();
    return res
      .status(200)
      .json({ msg: "address added successfully!", data: data });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "server error add address!", error: error });
  }
};
const UpdateUserAddress = async (req, res, next) => {
  console.log("req.params.id", req.body);
  try {
    console.log("11");
    const UserAddressExits = await UserAddress.find({ _id: req.params.id });
    console.log("22");
    if (!UserAddressExits) {
      return res.status(400).json({ msg: "Address Doesn't exits!" });
    }
    console.log("33");
    const { address, city, state, pin_code } = req.body;
    if (!address || !city || !state || !pin_code) {
      return res.status(400).json({ msg: "all filled required" });
    }
    console.log("44", req.user.userExits);
    const data = await UserAddress.findByIdAndUpdate(
      { _id: req.params.id },
      {
        user_id: req.user.userExits._id,
        address: address,
        city: city,
        state: state,
        pin_code: pin_code,
      },
      { new: true }
    );
    console.log("55");

    return res
      .status(200)
      .json({ msg: "address updated successfully!", data: data });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "server error update address!", error: error });
  }
};

const DeleteUserAddress = async (req, res, next) => {
  try {
    const data = await UserAddress.findOne({ _id: req.params.id });
    if (!data) {
      return res.status(400).json({ msg: "doesn't exist User Address!" });
    }
    if (req.user.userExits._id != data.user_id) {
      return res.status(400).json({ msg: "permission denied User Address!" });
    }

    await UserAddress.findOneAndRemove({ _id: data._id });
    return res
      .status(200)
      .json({ msg: "Success to Delete User Address!", data: data });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "server error delete User Address!", error: error });
  }
};

module.exports = {
  GetAllUserAddress,
  AddUserAddress,
  UpdateUserAddress,
  DeleteUserAddress,
  GetUserAddress,
};
