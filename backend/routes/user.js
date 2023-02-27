const router = require("express").Router();

const {
  registerStudent,
  registerAdmin,
  loginUser,
} = require("../controllers/user");

router.route("/student").post(registerStudent);
router.route("/admin").post(registerAdmin);
router.route("/login").post(loginUser);

module.exports = router;
