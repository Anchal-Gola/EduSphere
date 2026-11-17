const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventRegistrations,
  registerForEvent,
  unregisterFromEvent,
} = require("../controllers/EventController");

// Everyone logged in can view events
router.get("/", authMiddleware, getEvents);

// Admin
router.post("/", authMiddleware, roleMiddleware("ADMIN"), createEvent);
router.put("/:id", authMiddleware, roleMiddleware("ADMIN"), updateEvent);
router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), deleteEvent);
router.get(
  "/:id/registrations",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getEventRegistrations
);

// Student
router.post(
  "/:id/register",
  authMiddleware,
  roleMiddleware("STUDENT"),
  registerForEvent
);
router.delete(
  "/:id/register",
  authMiddleware,
  roleMiddleware("STUDENT"),
  unregisterFromEvent
);

module.exports = router;