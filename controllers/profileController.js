const Profile = require("../models/Profile.js");

const GetProfileData = async (req, res, next) => {
  try {
    const data = await Profile.find({ user_id: req.user.userExits._id });
    if (!data) {
      return res.status(400).json({ msg: "Profile Doesn't Exist!" });
    }
    return res.status(200).json({ msg: "GetData Successfully!", data: data });
  } catch (error) {
    return res.status(500).json({ msg: "GetProfileData Error!", error });
  }
};
const GetProfileDataAdmin = async (req, res, next) => {
  try {
    const data = await Profile.find({ user_id: req.params.id });
    if (!data) {
      return res.status(400).json({ msg: "Profile Doesn't Exist!" });
    }
    return res.status(200).json({ msg: "GetData Successfully!", data: data });
  } catch (error) {
    return res.status(500).json({ msg: "GetProfileData Error!", error });
  }
};

const GetAllProfileDataAdmin = async (req, res, next) => {
  console.log("data data");
  try {
    const data = await Profile.find({});

    if (!data) {
      return res.status(400).json({ msg: "Profile Doesn't Exist!" });
    }
    return res.status(200).json({ msg: "GetData Successfully!", data: data });
  } catch (error) {
    return res.status(500).json({ msg: "GetProfileData Error!", error });
  }
};

const AddProfileData = async (req, res, next) => {
  try {
    console.log(req.body);
    const { first_name, last_name, gender, dob } = req.body;
    console.log(":::1");
    const filePaths = req.files.map((file) => file.filename);
    console.log(":::2");
    if (filePaths.length > 0) {
      console.log(":::3");
      const data = await new Profile({
        user_id: req.user.userExits._id,
        first_name,
        last_name,
        gender,
        image: filePaths,
        dob,
      });
      console.log(":::4");
      await data.save();
      return res
        .status(200)
        .json({ msg: "Data Added Successfully!", data: data });
    } else {
      console.log(":::5", req.user.userExits._id);
      const data = await new Profile({
        user_id: req.user.userExits._id,
        first_name,
        last_name,
        gender,
        dob,
      });
      console.log(":::6", data);
      await data.save();
      return res
        .status(200)
        .json({ msg: "Data Added Successfully!", data: data });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "AddProfileData Error!", error });
  }
};

const UpdateProfileData = async (req, res, next) => {
  try {
    const data = await Profile.findById(req.params.id);
    console.log(":::1");
    if (!data) {
      return res.status(400).json({ msg: "Profile Doesn't Exist!" });
    }
    console.log(":::2");

    const { first_name, last_name, gender, dob } = req.body;
    console.log(":::3");
    const filePaths = req.files.map((file) => file.filename);
    console.log(":::4");
    if (filePaths.length > 0) {
      console.log(":::5");
      const newData = await Profile.findByIdAndUpdate(
        { _id: req.params.id },
        {
          user_id: req.user.userExits._id,
          first_name,
          last_name,
          gender,
          image: filePaths,
          dob,
        },
        { new: true }
      );
      return res
        .status(200)
        .json({ msg: "Data Updated Successfully!", data: newData });
    } else {
      console.log(":::6");
      const newData = await Profile.findByIdAndUpdate(
        { _id: req.params.id },
        {
          user_id: req.user.userExits._id,
          first_name,
          last_name,
          gender,

          dob,
        },
        { new: true }
      );
      return res
        .status(200)
        .json({ msg: "Data Updated Successfully!", data: newData });
    }
  } catch (error) {
    return res.status(500).json({ msg: "UpdateProfileData Error!", error });
  }
};

module.exports = {
  GetProfileData,
  AddProfileData,
  UpdateProfileData,
  GetProfileDataAdmin,
  GetAllProfileDataAdmin,
};
