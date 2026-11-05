
const NGO = require("../models/NGO");
const Notification = require("../models/Notification");

// Register an NGO for admin approval
const registerNGO = async (req, res) => {
  try {
    const {
      organizationName,
      registrationNumber,
      description,
      address,
      city,
      contactPerson,
      contactPhone,
    } = req.body;

    if (
      !organizationName ||
      !registrationNumber ||
      !address ||
      !city ||
      !contactPerson ||
      !contactPhone
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required NGO details.",
      });
    }

    const existingNGO = await NGO.findOne({
      $or: [
        { user: req.user._id },
        { registrationNumber: registrationNumber.trim() },
      ],
    });

    if (existingNGO) {
      return res.status(409).json({
        success: false,
        message: "NGO registration already exists.",
      });
    }

    const ngo = await NGO.create({
      user: req.user._id,
      organizationName: organizationName.trim(),
      registrationNumber: registrationNumber.trim(),
      description,
      address,
      city,
      contactPerson,
      contactPhone,
      approvalStatus: "PENDING",
    });

    await Notification.create({
      recipient: req.user._id,
      title: "NGO Registration Submitted",
      message: "Your NGO registration has been submitted for admin approval.",
      type: "NGO_APPROVAL",
    });

    res.status(201).json({
      success: true,
      message: "NGO registration submitted successfully. Await admin approval.",
      ngo,
    });
  } catch (error) {
    console.error("NGO registration error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to submit NGO registration.",
    });
  }
};

module.exports = {
  registerNGO,
};
