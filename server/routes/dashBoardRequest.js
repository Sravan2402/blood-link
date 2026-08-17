const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  donorDashboard,
  hospitalDashboard,
  adminDashboard,
} = require("../controllers/dashboard");

router.get("/donor", authMiddleware, donorDashboard);
router.get("/hospital", authMiddleware, hospitalDashboard);
router.get("/admin", authMiddleware, adminDashboard);
module.exports = router;
