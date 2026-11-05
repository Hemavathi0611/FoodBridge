const mongoose = require("mongoose");
const Donation = require("../models/Donation");
const NGO = require("../models/NGO");
const Volunteer = require("../models/Volunteer");
const Pickup = require("../models/Pickup");
const Notification = require("../models/Notification");

// Notifications should not undo or misreport a successful operation.
const sendNotificationSafely = async (notificationData) => {
  try {
    await Notification.create(notificationData);
  } catch (error) {
    console.error("Notification creation failed:", error.message);
  }
};

// Get pickups assigned to the logged-in volunteer
const getMyPickups = async (req, res) => {
  try {
    const volunteer = await Volunteer.findOne({
      user: req.user._id,
    });

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer profile not found.",
      });
    }

    const pickups = await Pickup.find({
      volunteer: volunteer._id,
    })
      .populate({
        path: "donation",
        select: "foodName foodType quantity unit pickupAddress pickupDeadline expiryDate status",
      })
      .populate({
        path: "ngo",
        select: "organizationName city contactPhone",
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: pickups.length,
      pickups,
    });
  } catch (error) {
    console.error("Get volunteer pickups error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve assigned pickups.",
    });
  }
};

// Assign a volunteer to an accepted donation
const assignVolunteer = async (req, res) => {
  try {
    const { volunteerId, scheduledAt } = req.body;
    const { donationId } = req.params;

    if (
      !mongoose.isValidObjectId(donationId) ||
      !mongoose.isValidObjectId(volunteerId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid donation or volunteer ID.",
      });
    }

    const donation = await Donation.findById(donationId);

    if (!donation || donation.status !== "ACCEPTED") {
      return res.status(400).json({
        success: false,
        message: "Donation must be accepted before assigning a volunteer.",
      });
    }

    const ngo = await NGO.findOne({
      user: req.user._id,
      approvalStatus: "APPROVED",
    });

    if (
      !ngo ||
      !donation.acceptedBy ||
      donation.acceptedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to assign this donation.",
      });
    }

    const volunteer = await Volunteer.findOne({
      _id: volunteerId,
      availability: true,
      isVerified: true,
    });

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: "Available verified volunteer not found.",
      });
    }

    const pickupTime = scheduledAt ? new Date(scheduledAt) : new Date();

    if (Number.isNaN(pickupTime.getTime()) || pickupTime < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid future pickup time.",
      });
    }

    const pickup = await Pickup.create({
      donation: donation._id,
      ngo: ngo._id,
      volunteer: volunteer._id,
      scheduledAt: pickupTime,
      status: "ASSIGNED",
    });

    donation.volunteer = volunteer.user;
    donation.status = "PICKUP_ASSIGNED";
    await donation.save();

    volunteer.availability = false;
    await volunteer.save();

    await Notification.insertMany([
      {
        recipient: volunteer.user,
        title: "New Pickup Assignment",
        message: `You have been assigned donation "${donation.foodName}".`,
        type: "PICKUP",
        relatedDonation: donation._id,
      },
      {
        recipient: donation.donor,
        title: "Volunteer Assigned",
        message: `A volunteer has been assigned to your donation "${donation.foodName}".`,
        type: "PICKUP",
        relatedDonation: donation._id,
      },
    ]).catch((error) => {
      console.error("Assignment notifications failed:", error.message);
    });

    return res.status(201).json({
      success: true,
      message: "Volunteer assigned successfully.",
      pickup,
    });
  } catch (error) {
    console.error("Volunteer assignment error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to assign volunteer.",
    });
  }
};

// Update pickup or delivery status
const updatePickupStatus = async (req, res) => {
  try {
    const { status, deliveryNotes } = req.body;
    const { id } = req.params;

    const allowedStatuses = ["PICKED_UP", "DELIVERED"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pickup status.",
      });
    }

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pickup ID.",
      });
    }

    const pickup = await Pickup.findById(id)
      .populate("donation")
      .populate("ngo");

    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: "Pickup record not found.",
      });
    }

    const volunteer = await Volunteer.findOne({
      user: req.user._id,
    });

    if (
      !volunteer ||
      pickup.volunteer.toString() !== volunteer._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this pickup.",
      });
    }

    if (!pickup.donation) {
      return res.status(404).json({
        success: false,
        message: "Associated donation not found.",
      });
    }

    if (
      (status === "PICKED_UP" && pickup.status !== "ASSIGNED") ||
      (status === "DELIVERED" && pickup.status !== "PICKED_UP")
    ) {
      return res.status(409).json({
        success: false,
        message: "Invalid status transition.",
      });
    }

    const now = new Date();

    pickup.status = status;

    if (status === "PICKED_UP") {
      pickup.pickedUpAt = now;
      pickup.donation.status = "PICKED_UP";
    }

    if (status === "DELIVERED") {
      pickup.deliveredAt = now;
      pickup.deliveryNotes = deliveryNotes || "";

      pickup.donation.status = "DELIVERED";
      pickup.donation.deliveredAt = now;

      volunteer.availability = true;
      volunteer.totalDeliveries += 1;

      await volunteer.save();
    }

    await pickup.donation.save();
    await pickup.save();

    if (pickup.ngo?.user) {
      await sendNotificationSafely({
        recipient: pickup.ngo.user,
        title: `Donation ${status.replace("_", " ")}`,
        message: `Donation "${pickup.donation.foodName}" status is now ${status}.`,
        type: "DELIVERY",
        relatedDonation: pickup.donation._id,
      });
    } else {
      console.error("NGO user not found for pickup notification.");
    }

    return res.status(200).json({
      success: true,
      message: `Donation ${status.toLowerCase()} successfully.`,
      pickup,
    });
  } catch (error) {
    console.error("Pickup status update error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update pickup status.",
    });
  }
};

module.exports = {
  getMyPickups,
  assignVolunteer,
  updatePickupStatus,
};
