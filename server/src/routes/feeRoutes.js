const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  getFees,
  createFee,
  markFeePaid,
  deleteFee,
  getMyFees,
  getMyFeeById,
} = require("../controllers/feeController");

// Student (keep these ABOVE the "/:id" routes)
router.get("/my", authMiddleware, roleMiddleware("STUDENT"), getMyFees);
router.get("/my/:id", authMiddleware, roleMiddleware("STUDENT"), getMyFeeById);

// Admin
router.get("/", authMiddleware, roleMiddleware("ADMIN"), getFees);
router.post("/", authMiddleware, roleMiddleware("ADMIN"), createFee);
router.put("/:id/pay", authMiddleware, roleMiddleware("ADMIN"), markFeePaid);
router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), deleteFee);

module.exports = router;