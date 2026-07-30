const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware.js");
const {
  createBloodRequest,
  getAllBloodRequests,
  getBloodRequestById,
  updateBloodRequest,
  deleteBloodRequest,
} = require("../controllers/bloodRequestController.js");

router.post("/", authMiddleware, createBloodRequest);

router.get("/", authMiddleware, getAllBloodRequests);

router.get("/:id", authMiddleware, getBloodRequestById);

router.put("/:id", authMiddleware, updateBloodRequest);

router.delete("/:id", authMiddleware, deleteBloodRequest);

module.exports = router;
