const Comment = require("../models/Comment.js");

const ShowComment = async (req, res, next) => {
  try {
    const allcomment = await Comment.find({ productID: req.body.productID });
    console.log(allcomment);
    return res
      .status(200)
      .json({ msg: "Success to all comment!", data: allcomment });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "server error get all comments!", error: error });
  }
};

const UserComment = async (req, res, next) => {
  try {
    const allcomment = await Comment.find({ userID: req.body.userID });
    return res
      .status(200)
      .json({ msg: "Success to user comment!", data: allcomment });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "server error get user comments!", error: error });
  }
};

const AddComment = async (req, res, next) => {
  try {
    const filePaths = await req?.files?.map((file) => file?.filename);
    const { productID, comment, rating, title } = req.body;

    if (!productID) {
      return res
        .status(400)
        .json({ msg: "to comment please fill required filled!" });
    }
    console.log(req.body, filePaths);

    const addcomment = await new Comment({
      userID: req.user.userExits._id,
      productID: productID,
      title: title ? title : "",
      comment: comment ? comment : "",
      rating: rating ? rating : 0,
      image: filePaths,
    });
    await addcomment.save();
    return res
      .status(200)
      .json({ msg: "your comment add Successfully!", data: addcomment });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: "server error add comment!", error: error });
  }
};

const UpdateComment = async (req, res, next) => {
  try {
    const feedbackExist = await Comment.findById({ _id: req.params.id });
    if (!feedbackExist) {
      return res.status(400).json({ msg: "feedback not possible!" });
    }
    const { userID, productID, product_feedback } = req.body;
    if (!product_feedback || !userID || !productID) {
      return res
        .status(400)
        .json({ msg: "to comment please fill required filled!" });
    }
    console.log(userID + " : " + req.user.userExits._id);
    if (req.user.userExits._id !== userID) {
      return res
        .status(400)
        .json({ msg: "you are not allowed to modifiy this comment!" });
    }
    const updatecomment = await Comment.findOneAndUpdate(
      { _id: feedbackExist._id },
      {
        userID: userID,
        productID: productID,
        product_feedback: product_feedback,
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ msg: "your comment updated Successfully!", data: updatecomment });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "server error add comment!", error: error });
  }
};

const DeleteComment = async (req, res, next) => {
  try {
    const commentExist = await Comment.findOne({ _id: req.params.id });
    if (!commentExist) {
      return res.status(400).json({ msg: "not able to delete comment!" });
    }
    await Comment.findOneAndRemove({ _id: commentExist._id });
    return res
      .status(200)
      .json({ msg: "Success to delete comment!", data: commentExist });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "server error get all comments!", error: error });
  }
};

module.exports = {
  AddComment,
  UpdateComment,
  DeleteComment,
  ShowComment,
  UserComment,
};
