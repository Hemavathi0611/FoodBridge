
const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    foodName: {
      type: String,
      required: true,
      trim: true,
    },
    foodType: {
      type: String,
      enum: [
        "COOKED",
        "RAW",
        "PACKAGED",
        "BAKERY",
        "FRUITS",
        "VEGETABLES",
        "OTHER",
      ],
      required: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0.1,
    },
    unit: {
      type: String,
      enum: ["KG", "LITRE", "PACKETS", "MEALS"],
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    pickupAddress: {
      type: String,
      required: true,
      trim: true,
    },
    pickupDeadline: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "AVAILABLE",
        "ACCEPTED",
        "PICKUP_ASSIGNED",
        "PICKED_UP",
        "DELIVERED",
        "CANCELLED",
      ],
      default: "AVAILABLE",
    },
    acceptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Donation", donationSchema);
