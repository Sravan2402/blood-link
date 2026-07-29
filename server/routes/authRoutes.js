const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  register,
  login,
  getProfile,
  updateProfile,
  deleteProfile,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.delete("/profile", authMiddleware, deleteProfile);

module.exports = router;
