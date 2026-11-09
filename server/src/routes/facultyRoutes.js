const express = require("express");
const router = express.Router();

const {
  createFaculty,
  getFaculty,
  updateFaculty,
  deleteFaculty,
} = require("../controllers/facultyController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/", authMiddleware, getFaculty);

router.post("/", authMiddleware, roleMiddleware("ADMIN"), createFaculty);

router.put("/:id", authMiddleware, roleMiddleware("ADMIN"), updateFaculty);

router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), deleteFaculty);

module.exports = router;