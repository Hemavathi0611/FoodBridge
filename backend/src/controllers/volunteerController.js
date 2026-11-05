const Volunteer = require("../models/Volunteer");
const Notification = require("../models/Notification");
const NGO = require("../models/NGO");

// Register volunteer profile
const registerVolunteer = async (req, res) => {
  try {
    const { address, city, vehicleType } = req.body;

    if (!address || !city || !vehicleType) {
      return res.status(400).json({
        success: false,
        message: "Address, city and vehicle type are required.",
      });
    }

    const allowedVehicles = ["BICYCLE", "BIKE", "CAR", "VAN", "NONE"];

    if (!allowedVehicles.includes(vehicleType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle type.",
      });
    }

    const existingVolunteer = await Volunteer.findOne({
      user: req.user._id,
    });

    if (existingVolunteer) {
      return res.status(409).json({
        success: false,
        message: "Volunteer profile already exists.",
      });
    }

    const volunteer = await Volunteer.create({
      user: req.user._id,
      address,
      city,
      vehicleType,
      availability: true,
    });

    await Notification.create({
      recipient: req.user._id,
      title: "Volunteer Registration Successful",
      message: "Your volunteer profile has been created successfully.",
      type: "SYSTEM",
    });

    res.status(201).json({
      success: true,
      message: "Volunteer profile created successfully.",
      volunteer,
    });
  } catch (error) {
    console.error("Volunteer registration error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to register volunteer.",
    });
  }
};

// Get logged-in volunteer profile
const getMyVolunteerProfile = async (req, res) => {
  try {
    const volunteer = await Volunteer.findOne({
      user: req.user._id,
    }).populate("user", "name email phone");

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer profile not found.",
      });
    }

    res.status(200).json({
      success: true,
      volunteer,
    });
  } catch (error) {
    console.error("Get volunteer profile error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve volunteer profile.",
    });
  }
};

// List verified and available volunteers for approved NGOs
const getAvailableVolunteers = async (req, res) => {
  try {
    const ngo = await NGO.findOne({
      user: req.user._id,
      approvalStatus: "APPROVED",
    });

    if (!ngo) {
      return res.status(403).json({
        success: false,
        message: "Only approved NGOs can view available volunteers.",
      });
    }

    const volunteers = await Volunteer.find({
      isVerified: true,
      availability: true,
    })
      .select("address city vehicleType availability totalDeliveries")
      .populate("user", "name email phone")
      .sort({ totalDeliveries: -1 });

    res.status(200).json({
      success: true,
      count: volunteers.length,
      volunteers,
    });
  } catch (error) {
    console.error("Get available volunteers error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve available volunteers.",
    });
  }
};

module.exports = {
  registerVolunteer,
  getMyVolunteerProfile,
  getAvailableVolunteers,
};
