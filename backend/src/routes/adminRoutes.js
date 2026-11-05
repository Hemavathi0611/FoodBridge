
const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getPendingNGOs,
  updateNGOApproval,
  getDashboardStats,
  updateVolunteerVerification,
  getAllVolunteers,
} = require("../controllers/adminController");

const { protect, authorize } = require("../middleware/auth");

// All routes below require Admin authentication
router.use(protect, authorize("ADMIN"));

// View all registered users
router.get("/users", getAllUsers);

// View pending NGO registrations
router.get("/ngos/pending", getPendingNGOs);

// Approve or reject an NGO
router.patch("/ngos/:id/approval", updateNGOApproval);

// View Admin dashboard statistics
router.get("/dashboard", getDashboardStats);

// Verify or reject a volunteer
router.patch("/volunteers/:id/verification", updateVolunteerVerification);

// Get all registered volunteers
router.get("/volunteers", getAllVolunteers);

module.exports = router;
