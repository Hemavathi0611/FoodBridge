const express = require("express");
const router = express.Router();

const {
  registerVolunteer,
  getMyVolunteerProfile,
  getAvailableVolunteers,
} = require("../controllers/volunteerController");

const { protect, authorize } = require("../middleware/auth");

// Register volunteer profile
router.post(
  "/register",
  protect,
  authorize("VOLUNTEER"),
  registerVolunteer
);

// Get logged-in volunteer profile
router.get(
  "/me",
  protect,
  authorize("VOLUNTEER"),
  getMyVolunteerProfile
);

// List available volunteers for approved NGOs
router.get(
  "/available",
  protect,
  authorize("NGO"),
  getAvailableVolunteers
);

module.exports = router;
