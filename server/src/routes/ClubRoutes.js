const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  getClubs,
  createClub,
  updateClub,
  deleteClub,
  getClubMembers,
  joinClub,
  leaveClub,
} = require("../controllers/ClubController");

// Everyone logged in can view clubs
router.get("/", authMiddleware, getClubs);

// Admin
router.post("/", authMiddleware, roleMiddleware("ADMIN"), createClub);
router.put("/:id", authMiddleware, roleMiddleware("ADMIN"), updateClub);
router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), deleteClub);
router.get(
  "/:id/members",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getClubMembers
);

// Student
router.post("/:id/join", authMiddleware, roleMiddleware("STUDENT"), joinClub);
router.delete("/:id/leave", authMiddleware, roleMiddleware("STUDENT"), leaveClub);

module.exports = router;