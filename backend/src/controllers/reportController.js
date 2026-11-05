const Donation = require("../models/Donation");
const Pickup = require("../models/Pickup");
const User = require("../models/User");

// 1. Donation Listings Report
const getDonationReport = async (req, res, next) => {
  try {
    const donations = await Donation.find()
      .populate("donor", "name email phone")
      .populate("acceptedBy", "name email")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: donations.length,
      report: donations,
    });
  } catch (error) {
    next(error);
  }
};

// 2. Pickup Status Report
const getPickupReport = async (req, res, next) => {
  try {
    const pickups = await Pickup.find()
      .populate({
        path: "donation",
        select: "foodName quantity unit pickupAddress",
      })
      .populate({
        path: "ngo",
        select: "organizationName city",
      })
      .populate({
        path: "volunteer",
        populate: {
          path: "user",
          select: "name email phone",
        },
      })
      .sort({ scheduledAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: pickups.length,
      report: pickups,
    });
  } catch (error) {
    next(error);
  }
};

// 3. Food Quantity Redistributed Report
const getFoodRedistributedReport = async (req, res, next) => {
  try {
    const summary = await Donation.aggregate([
      { $match: { status: "DELIVERED" } },
      {
        $group: {
          _id: "$unit",
          totalQuantity: { $sum: "$quantity" },
          totalDonations: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      count: summary.length,
      report: summary.map((item) => ({
        unit: item._id,
        totalQuantity: item.totalQuantity,
        totalDonations: item.totalDonations,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// 4. Donor Activity Report
const getDonorActivityReport = async (req, res, next) => {
  try {
    const donors = await User.aggregate([
      { $match: { role: "DONOR" } },
      {
        $lookup: {
          from: "donations",
          localField: "_id",
          foreignField: "donor",
          as: "donations",
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          phone: 1,
          totalDonations: { $size: "$donations" },
          deliveredDonations: {
            $size: {
              $filter: {
                input: "$donations",
                as: "donation",
                cond: { $eq: ["$$donation.status", "DELIVERED"] },
              },
            },
          },
          totalFoodQuantity: { $sum: "$donations.quantity" },
          joinedAt: "$createdAt",
        },
      },
      { $sort: { totalDonations: -1 } },
    ]);

    res.status(200).json({
      success: true,
      count: donors.length,
      report: donors,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDonationReport,
  getPickupReport,
  getFoodRedistributedReport,
  getDonorActivityReport,
};
