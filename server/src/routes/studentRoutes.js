const express = require("express");
const router = express.Router();

const {
  createStudent,
  getStudents,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/", authMiddleware, roleMiddleware("ADMIN", "FACULTY"), getStudents);

router.post("/", authMiddleware, roleMiddleware("ADMIN"), createStudent);

router.put("/:id", authMiddleware, roleMiddleware("ADMIN"), updateStudent);

router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), deleteStudent);

module.exports = router;