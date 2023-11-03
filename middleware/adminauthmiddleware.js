const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config;

const adminauthenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decode = jwt.verify(token, process.env.ADMIN_SECRET_TOKEN_KEY);
    req.user = decode;
    next();
  } catch (error) {
    if (error.name == "TokenExpiredError") {
      return res.json({
        msg: "Token Expired!",
        error: error,
      });
    } else {
      return res.json({
        msg: "Authentication Failed",
        error: error,
      });
    }
  }
};

module.exports = adminauthenticate;
