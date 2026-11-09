const express = require("express");
const {
  getFacultyStats,
  getStudentStats,
} = require("../controllers/roleDashboardController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/faculty",
  authMiddleware,
  roleMiddleware("FACULTY"),
  getFacultyStats
);

router.get(
  "/student",
  authMiddleware,
  roleMiddleware("STUDENT"),
  getStudentStats
);

module.exports = router;