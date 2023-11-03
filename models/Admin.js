const mongoose = require("mongoose");

const AdminSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      require: true,
    },
    last_name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    phone: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    zip_code: {
      type: Number,
      require: true,
    },
    company_name: {
      type: String,
      require: true,
    },
    company_location: {
      type: String,
      require: true,
    },
    company_logo: {
      type: String,
    },
    company_registration_number: {
      type: String,
      require: true,
    },
    company_type: {
      type: String,
      require: true,
    },
    company_since: {
      type: String,
      require: true,
    },
    total_outlets: {
      type: Number,
      require: true,
    },
    headquater_location: {
      type: String,
      require: true,
    },
    country: {
      type: String,
      require: true,
    },
    state: {
      type: String,
      require: true,
    },
    city: {
      type: String,
      require: true,
    },
    number_of_employee: {
      type: Number,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;
