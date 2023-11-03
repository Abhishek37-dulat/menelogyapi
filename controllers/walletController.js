const Wallet = require("../models/Wallet.js");

const GetWallet = async (req, res, next) => {
  try {
    const wallet = await Wallet.findOne({ user_id: req.user.userExits._id });
    return res.status(200).json({ msg: "get wallet!", data: wallet });
  } catch (error) {
    return res.status(500).json({ msg: "server error wallet!", error: error });
  }
};

module.exports = {
  GetWallet,
};
