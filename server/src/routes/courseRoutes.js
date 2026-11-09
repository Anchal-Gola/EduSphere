const express = require("express");
const router = express.Router();

const {
  createCourse,
  getCourses,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/", authMiddleware, getCourses);

router.post("/", authMiddleware, roleMiddleware("ADMIN"), createCourse);

router.put("/:id", authMiddleware, roleMiddleware("ADMIN"), updateCourse);

router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), deleteCourse);

module.exports = router;