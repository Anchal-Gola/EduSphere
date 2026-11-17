const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  getOpportunities,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  getApplications,
  updateApplicationStatus,
  applyToOpportunity,
  getMyApplications,
} = require("../controllers/opportunityController");

// Fixed paths first (they must stay ABOVE the "/:id" routes)
router.get(
  "/my/applications",
  authMiddleware,
  roleMiddleware("STUDENT"),
  getMyApplications
);

router.put(
  "/applications/:applicationId/status",
  authMiddleware,
  roleMiddleware("ADMIN"),
  updateApplicationStatus
);

// Everyone logged in can view opportunities
router.get("/", authMiddleware, getOpportunities);

// Admin
router.post("/", authMiddleware, roleMiddleware("ADMIN"), createOpportunity);
router.put("/:id", authMiddleware, roleMiddleware("ADMIN"), updateOpportunity);
router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), deleteOpportunity);
router.get(
  "/:id/applications",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getApplications
);

// Student
router.post(
  "/:id/apply",
  authMiddleware,
  roleMiddleware("STUDENT"),
  applyToOpportunity
);

module.exports = router;