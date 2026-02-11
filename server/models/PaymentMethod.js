// server/models/PaymentMethod.js

const mongoose = require("mongoose");

const PaymentMethodSchema = new mongoose.Schema(
  {
    // A reference to the customer who owns this payment method
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming your user model is named 'User'
      required: true,
    },
    // The type of payment method (e.g., 'CARD', 'UPI')
    type: {
      type: String,
      enum: ["CARD", "UPI", "NETBANKING"], // Added NETBANKING
      required: true,
    },
    // A nested object to hold specific details based on the type
    details: {
      // For CARD type
      cardNumber: {
        type: String,
        required: function () {
          return this.type === "CARD";
        },
      },
      cardHolderName: {
        type: String,
        required: function () {
          return this.type === "CARD";
        },
      },
      expiryDate: {
        // Stored as a string 'MM/YY'
        type: String,
        required: function () {
          return this.type === "CARD";
        },
      },
      cvv: {
        type: String,
        required: function () {
          return this.type === "CARD";
        },
        select: false,
      },

      // For UPI type
      upiId: {
        type: String,
        required: function () {
          return this.type === "UPI";
        },
      },

      // For NETBANKING type
      bankName: {
        type: String,
        required: function () {
          return this.type === "NETBANKING";
        },
      },
      accountNumber: {
        type: String,
        required: function () {
          return this.type === "NETBANKING";
        },
      },
    },
    // Flag to mark a payment method as the default for the user
    isDefault: {
      type: Boolean,
      default: false,
    },
    // Status to indicate verification status
    status: {
      type: String,
      enum: ["Active", "Verified", "Pending", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Create a unique compound index to prevent duplicate payment methods for a user
PaymentMethodSchema.index(
  { user: 1, "details.cardNumber": 1 },
  { unique: true, sparse: true }
);
PaymentMethodSchema.index(
  { user: 1, "details.upiId": 1 },
  { unique: true, sparse: true }
);

// Export the model
const PaymentMethod = mongoose.model("PaymentMethod", PaymentMethodSchema);

module.exports = PaymentMethod;
