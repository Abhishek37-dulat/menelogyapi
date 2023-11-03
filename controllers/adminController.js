const Admin = require("../models/Admin.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const Joi = require("joi");
const { ObjectId } = require("mongodb");
dotenv.config();

const ValidateRegister = async (data) => {
  const schema = Joi.object({
    first_name: Joi.string().min(3).max(30).required(),
    last_name: Joi.string().min(3).max(30).required(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
    phone: Joi.number().min(1000000000).max(9999999999).required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    confirm_password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    zip_code: Joi.number().min(10000).max(999999).required(),
    company_name: Joi.string().min(3).required(),
    company_location: Joi.string().min(3).required(),
    company_logo: Joi.string(),
    company_registration_number: Joi.string().min(3).max(30).required(),
    company_type: Joi.string().max(30).required(),
    company_since: Joi.string().max(30).required(),
    total_outlets: Joi.number().min(1).required(),
    headquater_location: Joi.string().required(),
    country: Joi.string().max(30).required(),
    state: Joi.string().max(30).required(),
    city: Joi.string().max(30).required(),
    number_of_employee: Joi.number().required(),
  });
  return schema.validateAsync(data);
};

const adminRegister = async (req, res, next) => {
  try {
    const data = req.body;
    const result = await ValidateRegister(data);

    if (result.error) {
      const validationErrors = result.error.details.map(
        (error) => error.message
      );
      return res.status(422).json({ msg: validationErrors });
    }

    const userExits = await Admin.findOne({
      $or: [{ email: result.email }, { phone: result.phone }],
    });
    if (userExits) {
      return res.status(400).json({ msg: "User already Exists!" });
    }

    if (result.password !== result.confirm_password) {
      return res.status(404).json({ msg: "password and confirm must match!" });
    }
    const hashedpassword = await bcrypt.hash(result.password, 10);
    result.password = await hashedpassword;
    const createData = await new Admin({
      ...result,
    });
    await createData.save();
    return res.status(200).json({
      msg: "admin created successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};
const ValidateLogin = async (data) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });
  return schema.validateAsync(data);
};
const adminLogin = async (req, res, next) => {
  try {
    const data = req.body;
    const result = await ValidateLogin(data);
    if (result.error) {
      const validationErrors = result.error.details.map(
        (error) => error.message
      );
      return res.status(422).json({ msg: validationErrors });
    }

    const userExits = await Admin.findOne({
      $or: [{ email: result.username }, { phone: result.username }],
    });
    if (!result.username || !result.password) {
      return res.status(400).json({ msg: "all fields are required!" });
    }
    if (!userExits) {
      return res
        .status(400)
        .json({ msg: "username or password doesn't match!" });
    }

    const passwordCheck = await bcrypt.compare(
      result.password,
      userExits.password
    );

    if (!passwordCheck) {
      return res
        .status(400)
        .json({ msg: "username or password doesn't match" });
    }
    let token = await jwt.sign(
      { userExits },
      process.env.ADMIN_SECRET_TOKEN_KEY,
      {
        expiresIn: "24h",
      }
    );
    console.log(userExits);
    let refreshtoken = await jwt.sign(
      { userExits },
      process.env.ADMIN_REFRESH_TOKEN_KEY,
      { expiresIn: "72h" }
    );
    return res.status(200).json({
      msg: "Login successfully",
      token: token,
      refreshtoken: refreshtoken,
    });
  } catch (error) {
    res.status(500).json({
      msg: "not able to Login internal server error!",
      error: error,
    });
  }
};

const refreshToken = async (req, res, next) => {
  const refreshtoken = req.body.refreshtoken;
  jwt.verify(
    refreshtoken,
    process.env.ADMIN_REFRESH_TOKEN_KEY,
    function (err, decode) {
      if (err) {
        res.status(400).json({
          msg: "refresh token error",
          error: err,
        });
      } else {
        const convertedObject = {
          _id: new ObjectId(decode.userExits._id),
          first_name: decode.userExits.first_name,
          last_name: decode.userExits.last_name,
          email: decode.userExits.email,
          phone: decode.userExits.phone,
          password: decode.userExits.password,
          zip_code: decode.userExits.zip_code,
          company_name: decode.userExits.company_name,
          company_location: decode.userExits.company_location,
          company_registration_number:
            decode.userExits.company_registration_number,
          company_type: decode.userExits.company_type,
          company_since: decode.userExits.company_since,
          total_outlets: decode.userExits.total_outlets,
          headquarter_location: decode.userExits.headquarter_location,
          country: decode.userExits.country,
          state: decode.userExits.state,
          city: decode.userExits.city,
          number_of_employee: decode.userExits.number_of_employee,
          createdAt: new Date(decode.userExits.createdAt),
          updatedAt: new Date(decode.userExits.updatedAt),
          __v: decode.userExits.__v,
        };

        // Transfer other properties
        convertedObject.iat = decode.iat;
        convertedObject.exp = decode.exp;
        console.log(convertedObject);
        let token = jwt.sign(
          { convertedObject },
          process.env.ADMIN_SECRET_TOKEN_KEY,
          {
            expiresIn: "24h",
          }
        );
        let refreshtoken = req.body.refreshtoken;
        res.status(200).json({ msg: "new tokens!", token, refreshtoken });
      }
    }
  );
};

module.exports = { adminLogin, adminRegister, refreshToken };
