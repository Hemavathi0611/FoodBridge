
const User = require("../models/User");
const NGO = require("../models/NGO");
const Notification = require("../models/Notification");
const Donation = require("../models/Donation");
const Volunteer = require("../models/Volunteer");

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch users.",
    });
  }
};

// Get pending NGO registrations
const getPendingNGOs = async (req, res) => {
  try {
    const ngos = await NGO.find({ approvalStatus: "PENDING" })
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: ngos.length,
      ngos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch NGO registrations.",
    });
  }
};

// Approve or reject an NGO
const updateNGOApproval = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be APPROVED or REJECTED.",
      });
    }

    if (status === "REJECTED" && !rejectionReason?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a rejection reason.",
      });
    }

    const ngo = await NGO.findById(req.params.id);

    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: "NGO registration not found.",
      });
    }

    if (ngo.approvalStatus !== "PENDING") {
      return res.status(409).json({
        success: false,
        message: "This NGO has already been reviewed.",
      });
    }

    ngo.approvalStatus = status;
    ngo.approvedBy = req.user._id;
    ngo.approvedAt = new Date();

    if (status === "REJECTED") {
      ngo.rejectionReason = rejectionReason.trim();
    }

    await ngo.save();

    await Notification.create({
      recipient: ngo.user,
      title: `NGO Registration ${status}`,
      message:
        status === "APPROVED"
          ? "Your NGO registration has been approved."
          : `Your NGO registration was rejected: ${rejectionReason.trim()}`,
      type: "NGO_APPROVAL",
    });

    res.status(200).json({
      success: true,
      message: `NGO registration ${status.toLowerCase()} successfully.`,
      ngo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to update NGO approval.",
    });
  }
};

// Get Admin dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalDonors,
      totalNGOs,
      totalVolunteers,
      pendingNGOs,
      totalDonations,
      availableDonations,
      deliveredDonations,
      totalFood,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "DONOR" }),
      NGO.countDocuments({ approvalStatus: "APPROVED" }),
      Volunteer.countDocuments(),
      NGO.countDocuments({ approvalStatus: "PENDING" }),
      Donation.countDocuments(),
      Donation.countDocuments({ status: "AVAILABLE" }),
      Donation.countDocuments({ status: "DELIVERED" }),
      Donation.aggregate([
        { $match: { status: "DELIVERED" } },
        { $group: { _id: null, quantity: { $sum: "$quantity" } } },
      ]),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalDonors,
        totalNGOs,
        totalVolunteers,
        pendingNGOs,
        totalDonations,
        availableDonations,
        deliveredDonations,
        totalFoodRedistributed: totalFood[0]?.quantity || 0,
      },
    });
  } catch (error) {
    console.error("Dashboard statistics error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to fetch dashboard statistics.",
    });
  }
};
// Verify or reject a volunteer
const updateVolunteerVerification = async (req, res) => {
  try {
    const { isVerified } = req.body;

    if (typeof isVerified !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isVerified must be true or false.",
      });
    }

    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { isVerified },
      { new: true, runValidators: true }
    ).populate("user", "name email phone");

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer not found.",
      });
    }

    await Notification.create({
      recipient: volunteer.user._id,
      title: isVerified ? "Volunteer Verified" : "Verification Revoked",
      message: isVerified
        ? "Your volunteer account has been verified. You can now receive assignments."
        : "Your volunteer verification has been revoked.",
      type: "SYSTEM",
    });

    res.status(200).json({
      success: true,
      message: isVerified
        ? "Volunteer verified successfully."
        : "Volunteer verification revoked.",
      volunteer,
    });
  } catch (error) {
    console.error("Volunteer verification error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to update volunteer verification.",
    });
  }
};
// Get all registered volunteers
const getAllVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find()
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: volunteers.length,
      volunteers,
    });
  } catch (error) {
    console.error("Fetch volunteers error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to fetch volunteers.",
    });
  }
};

module.exports = {
  getAllUsers,
  getPendingNGOs,
  getAllVolunteers,
  updateNGOApproval,
  getDashboardStats,
  updateVolunteerVerification,
};
