const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// Helper function for validation
const validateInput = (data, fields) => {
  for (const field of fields) {
    if (!data[field]) {
      throw new Error(`${field} is required`);
    }
  }
};

// Register User
// Register User
const registerUser = async (req, res) => {
  try {
    console.log("Incoming registration request:", req.body); // Debug log

    // FIX: Include 'name' in the destructuring
    const { role, email, password, name } = req.body;
    if (!role || !email || !password || !name) { // Also add name to this check
      return res.status(400).json({ error: "All fields required" });
    }

    console.log("Checking for existing user...");
    const existingUser = await User.findOne({ email })
      .maxTimeMS(10000) // Specific timeout for this query
      .exec();

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    console.log("Creating new user...");
    // FIX: Pass 'name' to the User constructor
    const newUser = new User({ role, email, password, name });
    await newUser.save();

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
// Login User
const loginUser = async (req, res) => {
  try {
    console.log("Incoming login request:", req.body); // Log the entire request body
    // Assuming validateInput ensures email, password, role are present
    // If validateInput is not robust, you might want to add explicit checks here
    // e.g., if (!req.body.email || !req.body.password || !req.body.role) { ... }

    const { email, password, role } = req.body; // Destructure for clarity

    console.log(`Attempting to find user with email: '${email}' and role: '${role}'`);
    const user = await User.findOne({ email, role });

    if (!user) {
      console.log("Login attempt: User not found for provided email/role combination.");
      throw new Error("Invalid credentials");
    }

    console.log(`Login attempt: User found. Stored password: '${user.password}', Provided password: '${password}'`);

    // IMPORTANT: Since you are not hashing passwords, this direct comparison works.
    // In a real application, you MUST hash passwords (e.g., with bcrypt)
    // and use a comparison function like bcrypt.compare().
    if (user.password !== password) {
      console.log("Login attempt: Password mismatch.");
      throw new Error("Invalid credentials");
    }

    console.log(`Login successful for user: ${user.email} (${user.role})`);

    res.json({
      message: "Login successful",
      role: user.role,
      name: user.name,
    });
  } catch (err) {
    console.error("Login error:", err); // Log the full error object for debugging
    res.status(401).json({ error: err.message });
  }
};

// Send OTP
const sendOtp = async (req, res) => {
  try {
    validateInput(req.body, ["email"]);

    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error("User not found");

    // Prevent frequent OTP requests
    if (user.otp?.expiresAt > Date.now() - 60000) {
      throw new Error("Please wait before requesting another OTP");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 300000; // 5 minutes

    user.otp = { code: otp, expiresAt: new Date(expiresAt) };
    await user.save();

    await sendEmail(
      req.body.email,
      "Your Password Reset OTP",
      `Your OTP code is: ${otp}`
    );

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Verify OTP
const verifyOtp = async (req, res) => {
  try {
    validateInput(req.body, ["email", "otp"]);

    const user = await User.findOne({ email: req.body.email });
    if (!user?.otp) throw new Error("Invalid OTP");

    if (user.otp.code !== req.body.otp) {
      throw new Error("Invalid OTP code");
    }

    if (user.otp.expiresAt < new Date()) {
      throw new Error("OTP expired");
    }

    // Clear OTP after verification
    user.otp = undefined;
    await user.save();

    res.json({ message: "OTP verified successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    validateInput(req.body, ["email", "otp", "newPassword"]);

    const user = await User.findOne({ email: req.body.email });
    if (!user?.otp) throw new Error("Invalid request");

    if (user.otp.code !== req.body.otp) {
      throw new Error("Invalid OTP");
    }

    if (user.otp.expiresAt < new Date()) {
      throw new Error("OTP expired");
    }

    user.password = req.body.newPassword;
    user.otp = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  sendOtp,
  verifyOtp,
  resetPassword,
};
