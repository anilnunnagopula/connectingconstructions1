// server/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["customer", "supplier", "admin"], // Added 'admin' role if you use it
      default: "customer",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    otp: {
      code: String,
      expiresAt: Date,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    location: {
      // Nested object for geographic location (lat/lng)
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },
    profilePictureUrl: {
      // NEW: URL for user's profile image
      type: String,
      default: "", // Default to empty string if no image
    },
    // --- Customer-specific fields ---
    cart: [
      // Array of items in the customer's cart
      {
        productId: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        // Could also store name, price, image directly for faster cart loading
      },
    ],
    wishlist: [
      // Array of product IDs in the customer's wishlist
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    ],
    notifications: [
      // Array of notifications for the user
      {
        message: { type: String, required: true },
        read: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
        link: String, // Optional link for the notification
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Mongoose pre-save hook to hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
