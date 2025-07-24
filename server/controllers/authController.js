const User = require("../models/User");
const sendEmail = require("../utils/sendEmail"); // Assuming this utility exists
const jwt = require("jsonwebtoken"); // NEW: Import jsonwebtoken for creating tokens

// Helper function to generate a JWT token
const generateToken = (id, role) => {
  // Make sure JWT_SECRET is defined in your .env file
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "1h", // Token valid for 1 hour (adjust as needed)
  });
};

// Helper function for basic validation (already good, but slightly refined)
const validateInput = (data, fields) => {
  for (const field of fields) {
    if (!data[field] || String(data[field]).trim() === "") {
      // Check for empty strings too
      throw new Error(`${field} is required`);
    }
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    console.log("Incoming registration request:", req.body);
    const { role, email, password, name, username } = req.body; // Added username

    // Validate required fields
    validateInput(req.body, ["role", "email", "password", "name", "username"]); // Added username validation

    console.log("Checking for existing user...");
    // Check if user already exists by email OR username
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    }).maxTimeMS(10000);

    if (existingUser) {
      const field = existingUser.email === email ? "Email" : "Username";
      return res.status(400).json({ error: `${field} already exists.` });
    }

    console.log("Creating new user...");
    // The User model's pre-save hook will hash the password
    const newUser = new User({ role, email, password, name, username }); // Pass username
    await newUser.save(); // This triggers the pre-save hook to hash 'password'

    // Generate token upon successful registration for immediate login
    const token = generateToken(newUser._id, newUser.role);

    res.status(201).json({
      message: "Registration successful",
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      token, // Send the token
    });
  } catch (err) {
    console.error("Registration error:", err);
    // Provide more specific error messages from validation, otherwise generic server error
    res.status(err.message.includes("required") ? 400 : 500).json({
      error: err.message || "Registration failed due to server error.",
    });
  }
};

// @desc    Login User
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    console.log("Incoming login request:", req.body);
    const { email, password, role } = req.body; // Assuming role is also sent from frontend for specific login

    validateInput(req.body, ["email", "password", "role"]);

    console.log(
      `Attempting to find user with email: '${email}' and role: '${role}'`
    );
    // Find user by email AND role
    const user = await User.findOne({ email, role });

    if (!user) {
      console.log(
        "Login attempt: User not found for provided email/role combination."
      );
      return res
        .status(401)
        .json({ error: "Invalid credentials (email/role mismatch)." });
    }

    // IMPORTANT CHANGE: Use the matchPassword method from the User model
    console.log(`Login attempt: User found. Comparing passwords...`);
    const isMatch = await user.matchPassword(password); // Using the instance method

    if (!isMatch) {
      console.log("Login attempt: Password mismatch.");
      return res
        .status(401)
        .json({ error: "Invalid credentials (password mismatch)." });
    }

    console.log(`Login successful for user: ${user.email} (${user.role})`);

    // Generate and send JWT token
    const token = generateToken(user._id, user.role);

    res.json({
      message: "Login successful",
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token, // Send the token
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(err.message.includes("required") ? 400 : 500).json({
      error: err.message || "Login failed due to server error.",
    });
  }
};

// @desc    Send OTP for password reset
// @route   POST /api/auth/send-otp
// @access  Public
const sendOtp = async (req, res) => {
  try {
    validateInput(req.body, ["email"]);

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      // Be vague for security: don't confirm if email exists or not
      return res
        .status(200)
        .json({
          message:
            "If an account with that email exists, an OTP has been sent.",
        });
    }

    // Prevent frequent OTP requests: 60 seconds cooldown
    if (
      user.otp &&
      user.otp.expiresAt &&
      user.otp.expiresAt.getTime() > Date.now()
    ) {
      const timeSinceLastOtp =
        (user.otp.expiresAt.getTime() - Date.now()) / 1000; // Remaining time in seconds
      if (timeSinceLastOtp > 240) {
        // If OTP was generated less than 1 minute ago (5min expiry - 4min buffer)
        return res
          .status(429)
          .json({
            error: `Please wait ${Math.ceil(
              timeSinceLastOtp - 240
            )} seconds before requesting another OTP.`,
          });
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 300000; // 5 minutes validity

    user.otp = { code: otp, expiresAt: new Date(expiresAt) };
    await user.save();

    // Ensure sendEmail utility is correctly configured in utils/sendEmail.js
    await sendEmail(
      req.body.email,
      "Your Connecting Constructions Password Reset OTP",
      `Your OTP code for password reset is: ${otp}. This code is valid for 5 minutes.`
    );

    res.json({ message: "OTP sent successfully! Please check your email." });
  } catch (err) {
    console.error("Send OTP error:", err);
    res
      .status(500)
      .json({ error: "Failed to send OTP. Please try again later." }); // Generic message for security
  }
};

// @desc    Reset Password with OTP
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    validateInput(req.body, ["email", "otp", "newPassword"]);

    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ error: "Invalid request (user not found for email)." }); // Vague for security
    }

    if (!user.otp || user.otp.code !== otp) {
      return res.status(400).json({ error: "Invalid or incorrect OTP code." });
    }

    if (user.otp.expiresAt < new Date()) {
      user.otp = undefined; // Clear expired OTP
      await user.save();
      return res
        .status(400)
        .json({ error: "OTP expired. Please request a new one." });
    }

    // Hash the new password using the User model's pre-save hook
    user.password = newPassword; // The pre-save hook will hash this on save
    user.otp = undefined; // Clear OTP after successful reset
    await user.save();

    res.json({ message: "Password reset successful!" });
  } catch (err) {
    console.error("Reset Password error:", err);
    res
      .status(500)
      .json({ error: "Failed to reset password. Please try again later." });
  }
};

// NEW: @desc    Get current authenticated user's profile
// @route   GET /api/auth/profile
// @access  Private (requires 'protect' middleware)
const getUserProfile = async (req, res) => {
  // req.user is populated by the 'protect' middleware
  if (req.user) {
    // Find the user by ID from the token and exclude the password
    const user = await User.findById(req.user.id).select("-password");
    if (user) {
      return res.json({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        address: user.address,
        createdAt: user.createdAt,
      });
    }
  }
  res.status(404).json({ message: "User not found." });
};

// NEW: @desc    Update current authenticated user's profile
// @route   PUT /api/auth/profile
// @access  Private (requires 'protect' middleware)
const updateUserProfile = async (req, res) => {
  if (!req.user) {
    // Should ideally be caught by protect middleware, but good safeguard
    return res.status(401).json({ message: "Not authorized." });
  }

  try {
    const user = await User.findById(req.user.id);

    if (user) {
      // Update fields if they are provided in the request body
      user.name = req.body.name || user.name;
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
      user.address = req.body.address || user.address;
      // You might or might not allow role change via profile update. For now, we'll keep it.
      // user.role = req.body.role || user.role;

      if (req.body.newPassword) {
        // If a new password is provided, update it
        user.password = req.body.newPassword; // Pre-save hook will hash this
      }

      const updatedUser = await user.save();

      // Generate a new token if user data critical to token (like role) changes, or simply to refresh session
      const token = generateToken(updatedUser._id, updatedUser.role);

      res.json({
        message: "Profile updated successfully!",
        _id: updatedUser._id,
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        phoneNumber: updatedUser.phoneNumber,
        address: updatedUser.address,
        token, // Send new token
      });
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    console.error("Update profile error:", error);
    res
      .status(500)
      .json({ error: "Failed to update profile: " + error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  sendOtp,
  resetPassword,
  getUserProfile, // Export new function
  updateUserProfile, // Export new function
};
