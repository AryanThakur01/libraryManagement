const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
  libraryName: { type: String, required: [true, `libraryName Missing`] },
  email: { type: String, required: [true, `Email Missing`] },
  password: { type: String, required: [true, `Password Missing`] },
});

adminSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
adminSchema.methods.createJWT = function () {
  return jwt.sign({ _id: this._id, isAdmin: true }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};
adminSchema.methods.comparePassword = async function (candidatePassword) {
  const isCorrect = await bcrypt.compare(candidatePassword, this.password);
  return isCorrect;
};
module.exports = mongoose.model("admin", adminSchema);
