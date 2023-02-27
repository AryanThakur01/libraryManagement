const jwt = require("jsonwebtoken");

const generateJWT = (_id, isAdmin) => {
  return jwt.sign({ _id, isAdmin }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

module.exports = { generateJWT };
