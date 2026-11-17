const express = require("express");
const router = express.Router();

const {
  createStudent,
  getStudents,
  updateStudent,
  deleteStudent,
  getMyStudentProfile,
  updateMyStudentProfile,
} = require("../controllers/studentController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Student's own profile (must stay ABOVE the "/:id" routes)
router.get(
  "/profile",
  authMiddleware,
  roleMiddleware("STUDENT"),
  getMyStudentProfile
);

router.put(
  "/profile",
  authMiddleware,
  roleMiddleware("STUDENT"),
  updateMyStudentProfile
);

// Admin / Faculty routes
router.get("/", authMiddleware, roleMiddleware("ADMIN", "FACULTY"), getStudents);

router.post("/", authMiddleware, roleMiddleware("ADMIN"), createStudent);

router.put("/:id", authMiddleware, roleMiddleware("ADMIN"), updateStudent);

router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), deleteStudent);

module.exports = router;