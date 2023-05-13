const Books = require("../models/books");
const asyncWrapper = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");
const Student = require("../models/student");

// /api/v1/library/admin
const addBooks = asyncWrapper(async (req, res) => {
  const { books } = req.body;
  const booksAdded = [];
  await books.forEach((book) => {
    Books.create({ ...book }).catch((err) => {
      return;
    });
    booksAdded.push(book);
  });
  res.status(StatusCodes.OK).json({ booksAdded });
});
// /api/v1/library/:libraryId
const getAllBooks = asyncWrapper(async (req, res) => {
  const { libraryId } = req.params;
  const { search } = req.query;
  const keyword = !search
    ? { library: libraryId }
    : {
        $and: [
          { library: libraryId },
          {
            $or: [
              { bookName: { $regex: search, $options: "i" } },
              { author: { $regex: search, $options: "i" } },
              { bookCode: { $regex: search } },
            ],
          },
        ],
      };
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * limit;
  const searchResult = await Books.find(keyword).limit(limit).skip(skip);
  console.log(searchResult);
  res.status(200).json({ ...searchResult });
});
// /api/v1/library/admin/:bookId
const updateBook = asyncWrapper(async (req, res) => {
  const { bookId } = req.params;
  let updatedBooks = await Books.findByIdAndUpdate(
    bookId,
    {
      ...req.body,
    },
    {
      new: true,
    }
  ).populate("library", "-password");
  res.status(StatusCodes.OK).json(updatedBooks);
});
// /api/v1/library/admin/:bookId
const removeBooks = asyncWrapper(async (req, res) => {
  const { bookId } = req.params;
  await Books.findByIdAndDelete(bookId);
  res
    .status(StatusCodes.OK)
    .json({ message: "Book Data Deleted Successfully" });
});

// /api/v1/library/student/:libraryId
const getAllStudents = asyncWrapper(async (req, res) => {
  const { libraryId } = req.params;
  const limit = req.query.limit || 10;
  const page = req.query.page || 1;
  const skip = (page - 1) * limit;
  const userList = await Student.find({ library: { $eq: libraryId } })
    .select("-password -library")
    .limit(limit)
    .skip(skip);
  res.status(200).send({ userList });
});
// /api/v1/library/searchStudent
const searchStudent = asyncWrapper(async (req, res) => {
  const { search } = req.query;
  const { libraryId } = req.params;
  const limit = req.query.limit || 5;
  const keyword = !search
    ? { library: libraryId }
    : {
        $and: [
          { library: libraryId },
          {
            $or: [
              { userName: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
            ],
          },
        ],
      };
  console.log(keyword);
  const users = await Student.find(keyword).select("-password -library");
  res.status(200).json(users); // note that sending (users) is better than sending ({users})
  // sending like this is better because response like this is being sent in the form of array rather than json
  // This is useful in frontend
});
const searchBooks = asyncWrapper(async (req, res) => {});

module.exports = {
  addBooks,
  getAllBooks,
  updateBook,
  removeBooks,
  getAllStudents,
  searchStudent,
};
