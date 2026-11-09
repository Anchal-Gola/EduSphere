
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  getFacultyAssignments,
  assignCourse,
  removeFacultyAssignment,
  getEnrollments,
  enrollStudent,
  removeEnrollment,
  getMyFacultyCourses,
  getMyStudentEnrollments,
  getMyFacultyStudents,
} = require("../controllers/assignmentController");

// Admin: manage all assignments and enrollments
router.get(
  "/faculty-courses",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getFacultyAssignments
);

router.post(
  "/faculty-courses",
  authMiddleware,
  roleMiddleware("ADMIN"),
  assignCourse
);

router.delete(
  "/faculty-courses/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  removeFacultyAssignment
);

router.get(
  "/student-courses",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getEnrollments
);

router.post(
  "/student-courses",
  authMiddleware,
  roleMiddleware("ADMIN"),
  enrollStudent
);

router.delete(
  "/student-courses/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  removeEnrollment
);

// Faculty: view assigned courses and enrolled students
router.get(
  "/my-courses",
  authMiddleware,
  roleMiddleware("FACULTY"),
  getMyFacultyCourses
);

router.get(
  "/my-students",
  authMiddleware,
  roleMiddleware("FACULTY"),
  getMyFacultyStudents
);

// Student: view own enrolled courses
router.get(
  "/my-enrollments",
  authMiddleware,
  roleMiddleware("STUDENT"),
  getMyStudentEnrollments
);

module.exports = router;
