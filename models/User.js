const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: [
      {
        address: {
          type: String,
        },
        city: {
          type: String,
        },
        state: {
          type: String,
        },
        pin_code: {
          type: Number,
        },
      },
    ],
    photo: {
      type: Object,
    },
    gender: {
      type: String,
    },
    date_of_birth: {
      type: String,
    },
    wishlist: [
      // {
      //   product: mongoose.Schema.Types.ObjectId,
      //   ref: "Product",
      // },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
