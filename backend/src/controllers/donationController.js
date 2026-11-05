const Donation = require("../models/Donation");
const NGO = require("../models/NGO");
const Notification = require("../models/Notification");
const mongoose = require("mongoose");

// Create a food donation
const createDonation = async (req, res) => {
  try {
    const {
      foodName,
      foodType,
      description,
      quantity,
      unit,
      expiryDate,
      pickupAddress,
      pickupDeadline,
    } = req.body;

    if (
      !foodName ||
      !foodType ||
      !quantity ||
      !unit ||
      !expiryDate ||
      !pickupAddress ||
      !pickupDeadline
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required donation details.",
      });
    }

    if (!Number.isFinite(Number(quantity)) || Number(quantity) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than zero.",
      });
    }

    const expiry = new Date(expiryDate);
    const deadline = new Date(pickupDeadline);

    if (
      Number.isNaN(expiry.getTime()) ||
      Number.isNaN(deadline.getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid expiry and pickup dates.",
      });
    }

    if (expiry <= new Date() || deadline <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Expiry date and pickup deadline must be in the future.",
      });
    }

    if (deadline > expiry) {
      return res.status(400).json({
        success: false,
        message: "Pickup deadline cannot be after the food expiry date.",
      });
    }

    const donation = await Donation.create({
      donor: req.user._id,
      foodName,
      foodType,
      description,
      quantity: Number(quantity),
      unit,
      expiryDate: expiry,
      pickupAddress,
      pickupDeadline: deadline,
    });

    res.status(201).json({
      success: true,
      message: "Food donation created successfully.",
      donation,
    });
  } catch (error) {
    console.error("Create donation error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to create donation.",
    });
  }
};

// Get donations created by the logged-in donor
const getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({
      donor: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: donations.length,
      donations,
    });
  } catch (error) {
    console.error("Get donations error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve donations.",
    });
  }
};

// View available donations for approved NGOs
const getAvailableDonations = async (req, res) => {
  try {
    const ngo = await NGO.findOne({
      user: req.user._id,
      approvalStatus: "APPROVED",
    });

    if (!ngo) {
      return res.status(403).json({
        success: false,
        message: "Only approved NGOs can view available donations.",
      });
    }

    const donations = await Donation.find({
      status: "AVAILABLE",
      expiryDate: { $gt: new Date() },
      pickupDeadline: { $gt: new Date() },
    })
      .populate("donor", "name phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: donations.length,
      donations,
    });
  } catch (error) {
    console.error("Get available donations error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve available donations.",
    });
  }
};

// Get donations accepted by the logged-in approved NGO
const getMyAcceptedDonations = async (req, res) => {
  try {
    const ngo = await NGO.findOne({
      user: req.user._id,
      approvalStatus: "APPROVED",
    });

    if (!ngo) {
      return res.status(403).json({
        success: false,
        message: "Only approved NGOs can view accepted donations.",
      });
    }

    const donations = await Donation.find({
      acceptedBy: req.user._id,
      status: "ACCEPTED",
    })
      .populate("donor", "name phone")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: donations.length,
      donations,
    });
  } catch (error) {
    console.error("Get accepted donations error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve accepted donations.",
    });
  }
};

// Accept a food donation (Approved NGO only)
const acceptDonation = async (req, res) => {
  try {
    const ngo = await NGO.findOne({
      user: req.user._id,
      approvalStatus: "APPROVED",
    });

    if (!ngo) {
      return res.status(403).json({
        success: false,
        message: "Only approved NGOs can accept donations.",
      });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid donation ID.",
      });
    }

    const donation = await Donation.findOneAndUpdate(
      {
        _id: req.params.id,
        status: "AVAILABLE",
        expiryDate: { $gt: new Date() },
        pickupDeadline: { $gt: new Date() },
      },
      {
        $set: {
          status: "ACCEPTED",
          acceptedBy: req.user._id,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation is unavailable or has expired.",
      });
    }

    await Notification.create({
      recipient: donation.donor,
      title: "Donation Accepted",
      message: `Your donation "${donation.foodName}" has been accepted by an NGO.`,
      type: "DONATION",
      relatedDonation: donation._id,
    });

    res.status(200).json({
      success: true,
      message: "Donation accepted successfully.",
      donation,
    });
  } catch (error) {
    console.error("Accept donation error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to accept donation.",
    });
  }
};

module.exports = {
  createDonation,
  getMyDonations,
  getAvailableDonations,
  getMyAcceptedDonations,
  acceptDonation,
};
