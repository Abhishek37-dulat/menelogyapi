const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { ObjectId } = require("mongodb");
const cloudinary = require("../database/cloudinary.js");
dotenv.config();

const userRegister = async (req, res, next) => {
  try {
    const { first_name, last_name, email, phone, password, confirm_password } =
      req.body;
    const userExits = await User.findOne({
      $or: [{ email: email }, { phone: phone }],
    });
    if (userExits) {
      return res.status(400).json({ msg: "User already Exists!" });
    }
    if (
      !first_name ||
      !last_name ||
      !email ||
      !phone ||
      !password ||
      !confirm_password
    ) {
      return res.status(400).json({ msg: "all fields are required!" });
    }
    if (password !== confirm_password) {
      return res.status(400).json({ msg: "password and confirm must match!" });
    }
    const hashedpassword = await bcrypt.hash(password, 10);
    const createData = await new User({
      first_name,
      last_name,
      email,
      phone,
      password: hashedpassword,
    });
    await createData.save();
    return res
      .status(200)
      .json({ msg: "user created successfully", data: createData });
  } catch (error) {
    res.status(500).json({
      msg: "not able to register internal server error!",
      error: error,
    });
  }
};

const userLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const userExits = await User.findOne({
      $or: [{ email: username }, { phone: username }],
    });

    if (!username || !password) {
      return res.status(400).json({ msg: "all fields are required!" });
    }
    if (!userExits) {
      return res
        .status(400)
        .json({ msg: "username or password doesn't match!" });
    }
    const passwordCheck = bcrypt.compare(password, userExits.password);
    if (!passwordCheck) {
      return res
        .status(400)
        .json({ msg: "username or password doesn't match" });
    }
    console.log("userExits: ", userExits);
    let token = jwt.sign({ userExits }, process.env.SECRET_TOKEN_KEY, {
      expiresIn: "24h",
    });
    let refreshtoken = jwt.sign({ userExits }, process.env.REFRESH_TOKEN_KEY, {
      expiresIn: "72h",
    });

    return res.status(200).json({
      msg: "Login successfully",
      token: token,
      refreshtoken: refreshtoken,
    });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "not able to Login internal server error!", error: error });
  }
};

const refreshToken = (req, res, next) => {
  const refreshtoken = req.body.refreshtoken;
  jwt.verify(
    refreshtoken,
    process.env.REFRESH_TOKEN_KEY,
    function (err, decode) {
      if (err) {
        res.status(400).json({
          msg: "refresh token error",
          error: err,
        });
      } else {
        const userExits = {
          _id: new ObjectId(decode.userExits._id),
          first_name: decode.userExits.first_name,
          last_name: decode.userExits.last_name,
          email: decode.userExits.email,
          phone: decode.userExits.phone,
          password: decode.userExits.password,
          createdAt: new Date(decode.userExits.createdAt),
          updatedAt: new Date(decode.userExits.updatedAt),
          __v: decode.userExits.__v,
        };

        // Transfer other properties
        userExits.iat = decode.iat;
        userExits.exp = decode.exp;
        let token = jwt.sign({ userExits }, process.env.SECRET_TOKEN_KEY, {
          expiresIn: "24h",
        });
        let refreshtoken = req.body.refreshtoken;
        res.status(200).json({ msg: "new tokens!", token, refreshtoken });
      }
    }
  );
};

const getAllUser = async (req, res, next) => {
  try {
    const data = await User.find({});

    res.status(200).json({ msg: "User Data", data: data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "server side error", error: error });
  }
};

const getSingleUser = async (req, res, next) => {
  try {
    const data = await User.findById(req.params.id);
    res.status(200).json({ msg: "User Data", data: data });
  } catch (error) {
    res.status(500).json({ msg: "server side error", error });
  }
};

const addUserAddress = async (req, res, next) => {
  try {
    const { address } = req.body;
    const userId = req.user.userExits._id;
    const userExits = await User.findById(userId);
    if (!userExits) {
      return res.status(400).json({ msg: "User not Exist!" });
    }
    if (
      !address ||
      !address.address ||
      !address.state ||
      !address.city ||
      !address.pin_code
    ) {
      return res.status(400).json({ msg: "all fields are required!" });
    }
    const newAddress = {
      address: address.address,
      city: address.city,
      state: address.state,
      pin_code: address.pin_code,
    };
    const createAddress = await User.findByIdAndUpdate(
      userId,
      {
        $push: { address: newAddress },
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ msg: "Address created successfully", data: createAddress });
  } catch (error) {
    res.status(500).json({
      msg: "not able to add address internal server error!",
      error: error,
    });
  }
};

const pullUserAddress = async (req, res, next) => {
  try {
    const addressId = req.params.id;
    const userId = req.user.userExits._id;
    const userExits = await User.findById(userId);
    if (!userExits) {
      return res.status(400).json({ msg: "User not Exist!" });
    }
    if (!addressId) {
      return res.status(400).json({ msg: "sorry not able to address!" });
    }

    const createAddress = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { address: { _id: addressId } },
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ msg: "Address removed successfully", data: createAddress });
  } catch (error) {
    res.status(500).json({
      msg: "not able to remove address internal server error!",
      error: error,
    });
  }
};

const updateUserAddress = async (req, res, next) => {
  try {
    const { address } = req.body;
    const addressId = req.params.id;
    const userId = req.user.userExits._id;
    const userExits = await User.findById(userId);
    if (!userExits) {
      return res.status(400).json({ msg: "User not Exist!" });
    }
    if (
      !address ||
      !address.address ||
      !address.state ||
      !address.city ||
      !address.pin_code
    ) {
      return res.status(400).json({ msg: "all fields are required!" });
    }
    const newAddress = {
      address: address.address,
      city: address.city,
      state: address.state,
      pin_code: address.pin_code,
    };
    const updatedAddress = await User.findOneAndUpdate(
      { _id: userId, "address._id": addressId },
      {
        $set: { "address.$": newAddress },
      },
      { new: true }
    );
    console.log(updatedAddress);
    return res
      .status(200)
      .json({ msg: "Address updated successfully", data: updatedAddress });
  } catch (error) {
    res.status(500).json({
      msg: "not able to update address internal server error!",
      error: error,
    });
  }
};

const updateUserInformation = async (req, res, next) => {
  try {
    const { first_name, last_name, gender, photo, date_of_birth } = req.body;
    console.log("h1");
    const userId = req.user.userExits._id;
    console.log("h2");
    const userExits = await User.findById(userId);
    console.log("h3");
    if (!userExits) {
      return res.status(400).json({ msg: "User not Exist!" });
    }
    console.log("h4");
    if (photo) {
      console.log("h50");
      const up = await cloudinary.uploader.upload(photo, {
        upload_preset: "userprofile",
      });
      console.log(up);
      console.log("h5");
      const updateDetails = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            first_name: first_name,
            last_name: last_name,
            gender: gender,
            photo: up,
            date_of_birth: date_of_birth,
          },
        },
        { new: true }
      );
      console.log("h6");
      console.log(updateDetails);
      return res.status(200).json({
        msg: "User Details with image updated successfully",
        data: updateDetails,
      });
    } else {
      const updateDetails = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            first_name: first_name,
            last_name: last_name,
            gender: gender,
            photo: photo,
            date_of_birth: date_of_birth,
          },
        },
        { new: true }
      );
      console.log(updateDetails);
      return res.status(200).json({
        msg: "User Details updated successfully",
        data: updateDetails,
      });
    }
  } catch (error) {
    res.status(500).json({
      msg: "not able to update User Details internal server error!",
      error: error,
    });
  }
};

module.exports = {
  userRegister,
  userLogin,
  refreshToken,
  getAllUser,
  getSingleUser,
  addUserAddress,
  pullUserAddress,
  updateUserAddress,
  updateUserInformation,
};
