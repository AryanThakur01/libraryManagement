const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    bookName: {
      type: String,
      required: [true, "Name Missing"],
    },
    author: {
      type: String,
      required: [true, "Author Missing"],
    },
    bookCode: {
      type: String,
      required: [true, "BookCode Missing"],
      unique: [true, "Already Present"],
    },
    library: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      required: [true, "libraryName Missing"],
    },
    issued: {
      type: Boolean,
      required: [true],
      default: false,
    },
    additionalInfo: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("book", bookSchema);
