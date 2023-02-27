const asyncHandler = require("express-async-handler");
const Student = require("../models/student");
const Admin = require("../models/admin");
const { StatusCodes } = require("http-status-codes");
const { generateJWT } = require("../config/generateToken");

const registerStudent = asyncHandler(async (req, res) => {
  const student = await Student.create({ ...req.body });
  const token = student.createJWT();
  res.status(200).json({
    student: {
      userName: student.userName,
      email: student.email,
      library: student.library,
    },
    token,
  });
  return;
});

const registerAdmin = asyncHandler(async (req, res) => {
  const admin = await Admin.create({ ...req.body });
  const token = admin.createJWT();
  res.status(200).json({
    student: { library: admin.libraryName, email: admin.email },
    token,
  });
  return;
});

const loginUser = asyncHandler(async (req, res) => {
  const reqBody = req.body;
  const email = reqBody.email.trim();
  const password = reqBody.password;
  const student = await Student.findOne({ email }).populate(
    "library",
    "-password -email"
  );
  const admin = await Admin.findOne({ email });
  const user = student ? student : admin;
  if (!email.trim()) {
    throw new Error("Email Missing");
  }
  if (!user) {
    throw new Error("Not Registered");
  }
  const passwordCheck = await user.comparePassword(password);
  let token;
  if (!passwordCheck) {
    throw new Error("Incorrect Password");
  }
  const isAdmin = student ? false : true;
  token = generateJWT(user._id, isAdmin);

  res.status(StatusCodes.OK).json({
    _id: user._id,
    userName: student ? user.userName : user.libraryName,
    email: user.email,
    library: student ? user.library : user._id,
    token,
  });
});
module.exports = { registerStudent, registerAdmin, loginUser };
