const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  submitAlumniRequest,
  getPublicOptions,
  getAlumniRequests,
  approveAlumniRequest,
  rejectAlumniRequest,
  getAlumni,
  createAlumni,
  updateAlumni,
  deleteAlumni,
} = require("../controllers/alumniController");

// PUBLIC (no auth)
router.post("/request", submitAlumniRequest);
router.get("/public-options", getPublicOptions);

// ADMIN: requests management
router.get(
  "/requests",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getAlumniRequests
);
router.put(
  "/requests/:id/approve",
  authMiddleware,
  roleMiddleware("ADMIN"),
  approveAlumniRequest
);
router.put(
  "/requests/:id/reject",
  authMiddleware,
  roleMiddleware("ADMIN"),
  rejectAlumniRequest
);

// ALL LOGGED IN: alumni directory
router.get("/", authMiddleware, getAlumni);

// ADMIN: alumni CRUD
router.post("/", authMiddleware, roleMiddleware("ADMIN"), createAlumni);
router.put("/:id", authMiddleware, roleMiddleware("ADMIN"), updateAlumni);
router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), deleteAlumni);

module.exports = router;