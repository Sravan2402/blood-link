const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  donorDashboard,
  hospitalDashboard,
  adminDashboard,
  availability_donor,
  location_update,
} = require("../controllers/dashboard");

router.get("/donor", authMiddleware, donorDashboard);
router.get("/hospital", authMiddleware, hospitalDashboard);
router.get("/admin", authMiddleware, adminDashboard);
router.patch("/donor/availability", authMiddleware, availability_donor);
router.patch("/donor/location", authMiddleware, location_update);
module.exports = router;
