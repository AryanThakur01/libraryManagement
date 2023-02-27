const asyncWrapper = require("express-async-handler");
const jwt = require("jsonwebtoken");

const authenticateUser = asyncWrapper(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith(`Bearer `))
    throw new Error("Not Authorized");
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = { authenticateUser };
