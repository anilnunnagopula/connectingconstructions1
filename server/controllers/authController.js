const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcryptjs"); // Import bcryptjs

// Helper function for validation
const validateInput = (data, fields) => {
  for (const field of fields) {
    if (!data[field]) {
      throw new Error(`${field} is required`);
    }
  }
};

// Register User
const registerUser = async (req, res) => {
  try {
    console.log("Incoming registration request:", req.body);

    const { role, email, password, name } = req.body;
    if (!role || !email || !password || !name) {
      return res.status(400).json({ error: "All fields required" });
    }

    console.log("Checking for existing user...");
    const existingUser = await User.findOne({ email }).maxTimeMS(10000).exec();

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    console.log("Creating new user...");
    // The User model's pre-save hook will hash the password
    const newUser = new User({ role, email, password, name });
    await newUser.save(); // This triggers the pre-save hook to hash 'password'

    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({
      error: "Registration failed",
      details: err.message,
    });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    console.log("Incoming login request:", req.body);

    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ error: "Email, password, and role are required" });
    }

    console.log(
      `Attempting to find user with email: '${email}' and role: '${role}'`
    );
    const user = await User.findOne({ email, role });

    if (!user) {
      console.log(
        "Login attempt: User not found for provided email/role combination."
      );
      return res.status(401).json({ error: "Invalid credentials" }); // Use return to stop execution
    }

    // IMPORTANT CHANGE: Use bcrypt.compare() to compare the provided password with the hashed password
    console.log(`Login attempt: User found. Comparing passwords...`);
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("Login attempt: Password mismatch.");
      return res.status(401).json({ error: "Invalid credentials" }); // Use return to stop execution
    }

    console.log(`Login successful for user: ${user.email} (${user.role})`);

    res.json({
      message: "Login successful",
      role: user.role,
      name: user.name,
      // You might want to send a JWT token here for actual authentication
      // token: generateAuthToken(user)
    });
  } catch (err) {
    console.error("Login error:", err);
    // Be careful with exposing err.message directly in production for security reasons
    res.status(500).json({ error: "Login failed: " + err.message });
  }
};

// Send OTP
const sendOtp = async (req, res) => {
  try {
    validateInput(req.body, ["email"]);

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" }); // Use 404 for "not found"
    }

    // Prevent frequent OTP requests (e.g., within 1 minute)
    // Ensure user.otp exists and has expiresAt
    if (
      user.otp &&
      user.otp.expiresAt &&
      user.otp.expiresAt.getTime() > Date.now()
    ) {
      // Check if current OTP is still valid (not expired) and recently sent (within 1 min)
      if (user.otp.expiresAt.getTime() - Date.now() < 4 * 60 * 1000) {
        // If less than 4 mins till expiration (sent within last minute)
        return res
          .status(429)
          .json({ error: "Please wait before requesting another OTP." });
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 300000; // 5 minutes (in milliseconds)

    user.otp = { code: otp, expiresAt: new Date(expiresAt) };
    await user.save();

    await sendEmail(
      req.body.email,
      "Your Password Reset OTP",
      `Your OTP code is: ${otp}`
    );

    res.json({ message: "OTP sent successfully! Please check your email." });
  } catch (err) {
    console.error("Send OTP error:", err); // Log the actual error
    res.status(500).json({ error: err.message || "Failed to send OTP." }); // Provide a generic message for security
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    validateInput(req.body, ["email", "otp", "newPassword"]);

    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Check if OTP exists for the user
    if (!user.otp || !user.otp.code || !user.otp.expiresAt) {
      return res
        .status(400)
        .json({ error: "No OTP found for this user or invalid request." });
    }

    if (user.otp.code !== otp) {
      return res.status(400).json({ error: "Invalid OTP code." });
    }

    if (user.otp.expiresAt < new Date()) {
      // Clear expired OTP to prevent reuse
      user.otp = undefined;
      await user.save();
      return res
        .status(400)
        .json({ error: "OTP expired. Please request a new one." });
    }

    // Hash the new password before saving
    // Although your User model might have a pre-save hook,
    // explicitly hashing it here makes the intent clearer and can handle
    // cases where you might update a user without going through a full save cycle
    const salt = await bcrypt.genSalt(10); // Use the same salt rounds as in your User model
    user.password = await bcrypt.hash(newPassword, salt);

    user.otp = undefined; // Clear OTP after successful reset
    await user.save();

    res.json({ message: "Password reset successful!" });
  } catch (err) {
    console.error("Reset Password error:", err);
    res.status(500).json({ error: err.message || "Failed to reset password." });
  }
};

module.exports = {
  registerUser,
  loginUser,
  sendOtp,
  // Removed verifyOtp as it's typically combined into resetPassword for a single flow
  resetPassword,
};
