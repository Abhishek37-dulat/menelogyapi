const mongoose = require("mongoose");

const ProfileSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  gender: {
    type: String,
  },
  image: [
    {
      type: Object,
    },
  ],
  dob: {
    type: String,
  },
});

const Profile = mongoose.model("Profile", ProfileSchema);

module.exports = Profile;
