const express = require("express");
const {
  getCollegeAnalytics,
  getDepartmentAnalytics,
  getCourseAnalytics,
  getGrowthAnalytics,
  getInsights,
} = require("../controllers/analyticsController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware, roleMiddleware("ADMIN"));

router.get("/colleges", getCollegeAnalytics);
router.get("/departments", getDepartmentAnalytics);
router.get("/courses", getCourseAnalytics);
router.get("/growth", getGrowthAnalytics);
router.get("/insights", getInsights);

module.exports = router;