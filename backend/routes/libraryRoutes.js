const router = require("express").Router();

const {
  addBooks,
  getAllBooks,
  updateBook,
  removeBooks,
  getAllStudents,
  searchStudent,
} = require("../controllers/libraryController");

router.route("/:libraryId").get(getAllBooks);
router.route("/admin").post(addBooks);
router.route("/admin/:bookId").put(updateBook).delete(removeBooks);
router.route("/student/:libraryId").get(getAllStudents);
router.route("/search/student/:libraryId").get(searchStudent); // note that /searchStudent will throw a cast error
// The above cast error is because of the fact that /searchStudent route will be similar to /:libraryId
// This will put the searchStudent in libraryId parameter

module.exports = router;
