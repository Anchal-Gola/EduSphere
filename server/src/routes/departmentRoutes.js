const express = require("express");
const router = express.Router();

const {
  createDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/departmentController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/", authMiddleware, getDepartments);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  createDepartment
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  updateDepartment
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteDepartment
);

module.exports = router;