
const express = require("express");
const router = express.Router();

const { registerNGO } = require("../controllers/ngoController");
const { protect, authorize } = require("../middleware/auth");

// Submit NGO registration (NGO users only)
router.post("/register", protect, authorize("NGO"), registerNGO);

module.exports = router;
