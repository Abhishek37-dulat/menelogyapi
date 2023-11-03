const Cart = require("../models/Cart.js");

const GetAllCartItems = async (req, res, next) => {
  try {
    const allcart = await Cart.find({});
    if (!allcart) {
      return res.status(400).json({ msg: "error to all cart item!" });
    }
    return res
      .status(200)
      .json({ msg: "Success to all cart item!", data: allcart });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "server error get all Save Item!", error: error });
  }
};

const GetAllCartItem = async (req, res, next) => {
  try {
    const allcart = await Cart.find({ userID: req.user.userExits._id });
    if (!allcart) {
      return res
        .status(400)
        .json({ msg: "error to all cart item!", data: allcart });
    }
    return res
      .status(200)
      .json({ msg: "Success to all save item!", data: allcart });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "server error get all Save Item!", error: error });
  }
};

const GetCartItem = async (req, res, next) => {
  try {
    const allcart = await Cart.find({ userID: req.user.userExits._id });
    if (!allcart) {
      return res
        .status(400)
        .json({ msg: "error to all cart item!", data: allcart });
    }
    const ItemData = await Cart.findById(req.params.id);
    if (!ItemData) {
      return res.status(400).json({ msg: "item doesn't exits!" });
    }
    return res
      .status(200)
      .json({ msg: "Success to all save item!", data: ItemData });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "server error get all Save Item!", error: error });
  }
};

const AddCartItem = async (req, res, next) => {
  try {
    const { product_id, total_count, color, size, density } = req.body;
    if (!product_id || !total_count) {
      return res.status(400).json({ msg: "all filled required" });
    }
    const { _id } = req.user.userExits;
    console.log(req.user.userExits);
    const addCart = await new Cart({
      userID: _id,
      product_id: product_id,
      total_count: total_count,
      color,
      size,
      density,
    });
    await addCart.save();
    return res.status(200).json({ msg: "added successfully!", data: addCart });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "server error add one Cart Item!", error: error });
  }
};

const UpdateCartItem = async (req, res, next) => {
  try {
    const itemExists = await Cart.findById(req.params.id);
    if (!itemExists) {
      return res.status(400).json({ msg: "item Doesn't exit in cart!" });
    }
    const { product_id, total_count } = req.body;
    if (!product_id || !total_count) {
      return res.status(400).json({ msg: "all filled required" });
    }
    const { _id } = req.user.userExits;

    const addCart = await Cart.findByIdAndUpdate(
      { _id: itemExists._id },
      {
        userID: _id,
        product_id: product_id,
        total_count: total_count,
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ msg: "updated successfully!", data: addCart });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "server error update one Cart Item!", error: error });
  }
};

const DeleteCartItem = async (req, res, next) => {
  try {
    const allCart = await Cart.findOne({ _id: req.params.id });
    if (!allCart) {
      return res.status(400).json({ msg: "doesn't exist Cart item!" });
    }
    if (req.user.userExits._id != allCart.userID) {
      return res.status(400).json({ msg: "permission denied item!" });
    }

    await Cart.findOneAndRemove({ _id: allCart._id });
    return res
      .status(200)
      .json({ msg: "Success to Delete Cart item!", data: allCart });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "server error delete Cart Item!", error: error });
  }
};

module.exports = {
  GetAllCartItems,
  GetAllCartItem,
  GetCartItem,
  AddCartItem,
  DeleteCartItem,
  UpdateCartItem,
};
