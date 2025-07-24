// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Important for the pre-save hook

const userSchema = new mongoose.Schema(
  {
    username: {
      // Added username for better identity or login options
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["customer", "supplier"], // Ensure only these roles are accepted
      default: "customer", // Set a default if not explicitly provided during registration
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"], // Added regex for email format
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Good practice to enforce minimum length
    },
    name: {
      // Consider splitting into firstName and lastName if needed
      type: String,
      required: true,
      trim: true,
    },
    otp: {
      code: String,
      expiresAt: Date,
    },
    // Optional additional fields for user profiles (as discussed previously)
    phoneNumber: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
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

// NEW: Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
