// models/User.js (Example - you should have something similar)
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Important for the pre-save hook

const userSchema = new mongoose.Schema({
  role: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  otp: {
    code: String,
    expiresAt: Date,
  },
  // ... other fields
});

// Mongoose pre-save hook to hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    // Only hash if password field is new or modified
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10); // 10 rounds is a good default
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error); // Pass error to the next middleware
  }
});

module.exports = mongoose.model("User", userSchema);
