const express = require("express");
const router = express.Router();

const {
  getDonationReport,
  getPickupReport,
  getFoodRedistributedReport,
  getDonorActivityReport,
} = require("../controllers/reportController");

const { protect, authorize } = require("../middleware/auth");

// All report routes require Admin authentication
router.use(protect, authorize("ADMIN"));

router.get("/donations", getDonationReport);
router.get("/pickups", getPickupReport);
router.get("/food-redistributed", getFoodRedistributedReport);
router.get("/donor-activity", getDonorActivityReport);

module.exports = router;
