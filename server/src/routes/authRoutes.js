const express = require("express");

const {
  registerStudent,
  loginStudent,
  registerAdmin,
  loginAdmin,
  loginFaculty,
} = require("../controllers/authController");

const router = express.Router();

router.post("/student/register", registerStudent);
router.post("/student/login", loginStudent);

router.post("/admin/register", registerAdmin);
router.post("/admin/login", loginAdmin);
router.post("/faculty/login", loginFaculty);

module.exports = router;