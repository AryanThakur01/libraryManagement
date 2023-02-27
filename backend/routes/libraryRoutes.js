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
router.route("/searchStudent").get(searchStudent);

module.exports = router;
