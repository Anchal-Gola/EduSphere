const express = require("express");
const router = express.Router();

const {
  createCollege,
  getColleges,
  updateCollege,
  deleteCollege,
} = require("../controllers/collegeController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/", authMiddleware, getColleges);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  createCollege
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  updateCollege
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteCollege
);

module.exports = router;