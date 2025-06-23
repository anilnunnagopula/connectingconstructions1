// const sendEmail = require("../utils/sendEmail");
const User = require("../models/User");

// REGISTER USER
const registerUser = async (req, res) => {
  try {
    // console.log("⚡ Register API hit"); // Add this
    const { role, email, password } = req.body;

    if (!role || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // ✅ No hashing for now (we'll add bcrypt later)
    const newUser = new User({ role, email, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("❌ Register Error:", err.message);
    res
      .status(500)
      .json({ error: "Something went wrong", details: err.message });
  }
};

// LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Match both email and role
    const user = await User.findOne({ email, role });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful", role: user.role });
  } catch (err) {
    console.error("❌ Login Error:", err.message);
    res
      .status(500)
      .json({ error: "Something went wrong", details: err.message });
  }
};

// SEND OTP
const sendEmail = require("../utils/sendEmail"); // 👈 import it
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Prevent frequent resends (1 per minute)
    if (
      user.otp?.expiresAt &&
      user.otp.expiresAt > new Date(Date.now() - 60 * 1000)
    ) {
      return res
        .status(429)
        .json({ error: "Please wait before requesting again." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

    // Save OTP to DB
    user.otp = { code: otp, expiresAt };
    await user.save();

    await sendEmail(
      email,
      "Your OTP for Password Reset",
      `Your OTP is: ${otp}`
    );

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("❌ OTP Error:", err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};


const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ error: "All fields required" });

    const user = await User.findOne({ email });
    if (!user || !user.otp || user.otp.code !== otp)
      return res.status(400).json({ error: "Invalid OTP" });

    if (user.otp.expiresAt < new Date()) {
      return res.status(400).json({ error: "OTP expired" });
    }

    // Optional: clear OTP after verification
    user.otp = undefined;
    await user.save();

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error("❌ Verify OTP Error:", err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    console.log("BODY:", req.body);

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user || !user.otp) {
      return res.status(404).json({ error: "User or OTP not found" });
    }

    // Check OTP match and expiry
    if (user.otp.code !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (user.otp.expiresAt < new Date()) {
      return res.status(400).json({ error: "OTP expired" });
    }

    // Set new password
    user.password = newPassword;
    user.otp = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("❌ Reset Password Error:", err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};


module.exports = { registerUser, loginUser, sendOtp,verifyOtp,resetPassword, };
