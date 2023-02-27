const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const studentSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "Name Missing"],
    },
    email: {
      type: String,
      required: [true, "Email Missing"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide valid email",
      ],
      unique: [true, "Already Registered"],
    },
    password: {
      type: String,
      required: [true, "Password Missing"],
      minLength: [8, "MinLength 8"],
    },
    library: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "admin",
        required: [true, `Student's Library?`],
      },
    ],
  },
  {
    timestamps: true,
  }
);

studentSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

studentSchema.methods.createJWT = function () {
  return jwt.sign({ _id: this._id, isAdmin: false }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
studentSchema.methods.comparePassword = async function (candidatePassword) {
  const isCorrect = await bcrypt.compare(candidatePassword, this.password);
  return isCorrect;
};

module.exports = mongoose.model("Student", studentSchema);
