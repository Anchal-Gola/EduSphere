const express = require("express");
const router = express.Router();

const {
  createFaculty,
  getFaculty,
  updateFaculty,
  deleteFaculty,
  getMyFacultyProfile,
  updateMyFacultyProfile,
} = require("../controllers/facultyController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Faculty's own profile (must stay ABOVE the "/:id" routes)
router.get(
  "/profile",
  authMiddleware,
  roleMiddleware("FACULTY"),
  getMyFacultyProfile
);

router.put(
  "/profile",
  authMiddleware,
  roleMiddleware("FACULTY"),
  updateMyFacultyProfile
);

// Other routes
router.get("/", authMiddleware, getFaculty);

router.post("/", authMiddleware, roleMiddleware("ADMIN"), createFaculty);

router.put("/:id", authMiddleware, roleMiddleware("ADMIN"), updateFaculty);

router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), deleteFaculty);

module.exports = router;