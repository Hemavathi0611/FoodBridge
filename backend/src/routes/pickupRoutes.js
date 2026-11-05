const express = require("express");
const router = express.Router();

const {
  getMyPickups,
  assignVolunteer,
  updatePickupStatus,
} = require("../controllers/pickupController");

const { protect, authorize } = require("../middleware/auth");

// Volunteer views assigned pickups
router.get(
  "/my",
  protect,
  authorize("VOLUNTEER"),
  getMyPickups
);

// NGO assigns a volunteer to an accepted donation
router.post(
  "/donations/:donationId/assign",
  protect,
  authorize("NGO"),
  assignVolunteer
);

// Assigned volunteer updates pickup and delivery status
router.patch(
  "/:id/status",
  protect,
  authorize("VOLUNTEER"),
  updatePickupStatus
);

module.exports = router;
