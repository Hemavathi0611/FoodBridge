const express = require("express");
const router = express.Router();

const {
  createDonation,
  getMyDonations,
  getAvailableDonations,
  getMyAcceptedDonations,
  acceptDonation,
} = require("../controllers/donationController");

const { protect, authorize } = require("../middleware/auth");

// Create a donation (Donor only)
router.post("/", protect, authorize("DONOR"), createDonation);

// View donor's donations
router.get("/my", protect, authorize("DONOR"), getMyDonations);

// View available donations (NGO only)
router.get("/available", protect, authorize("NGO"), getAvailableDonations);

// View donations accepted by the logged-in NGO
router.get("/accepted", protect, authorize("NGO"), getMyAcceptedDonations);

// Accept a donation (NGO only)
router.patch("/:id/accept", protect, authorize("NGO"), acceptDonation);

module.exports = router;
