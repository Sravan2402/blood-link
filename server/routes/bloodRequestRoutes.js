const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware.js");
const {
  completeBloodRequest,
  createBloodRequest,
  getAllBloodRequests,
  getBloodRequestById,
  bloodAccepted,
  getMyBloodRequests,
  getOpenBloodRequests,
  respondToBloodRequest,
  getBloodRequestResponses,
  donationHistory,
  hospitalDonationHistory,
} = require("../controllers/bloodRequestController.js");
router.get("/test", (req, res) => {
  console.log("🔥 Blood request route is working");

  res.status(200).json({
    success: true,
    message: "Blood request route is working",
  });
});
router.post("/", authMiddleware, createBloodRequest);

router.get("/my", authMiddleware, getMyBloodRequests);
router.get("/", authMiddleware, getAllBloodRequests);
router.get("/open", authMiddleware, getOpenBloodRequests);

router.post("/:requestId/respond", authMiddleware, respondToBloodRequest);
router.get("/:requestId/responses", authMiddleware, getBloodRequestResponses);
router.patch("/responses/:responseId/select", authMiddleware, bloodAccepted);
router.patch("/:requestId/complete", authMiddleware, completeBloodRequest);
router.get("/donors/my-donations", authMiddleware, donationHistory);
router.get("/hospitals/my-donations", authMiddleware, hospitalDonationHistory);

router.get("/:id", authMiddleware, getBloodRequestById);
module.exports = router;
