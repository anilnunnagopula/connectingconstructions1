const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// Helper function to generate a JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

// Helper function for basic validation
const validateInput = (data, fields) => {
  for (const field of fields) {
    if (!data[field] || String(data[field]).trim() === "") {
      throw new Error(`${field} is required`);
    }
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    console.log("Incoming registration request:", req.body);
    const { role, email, password, name, username } = req.body;

    validateInput(req.body, ["role", "email", "password", "name", "username"]);

    console.log("Checking for existing user...");
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    }).maxTimeMS(10000);

    if (existingUser) {
      const field = existingUser.email === email ? "Email" : "Username";
      return res.status(400).json({ error: `${field} already exists.` });
    }

    console.log("Creating new user...");
    const newUser = new User({ role, email, password, name, username });
    await newUser.save();

    const token = generateToken(newUser._id, newUser.role);

    res.status(201).json({
      message: "Registration successful",
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      token,
      profilePictureUrl: newUser.profilePictureUrl || null,
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(err.message.includes("required") ? 400 : 500).json({
      error: err.message || "Registration failed due to server error.",
    });
  }
};

// @desc    Login User
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    console.log("Incoming login request:", req.body);
    const { email, password, role } = req.body;

    validateInput(req.body, ["email", "password", "role"]);

    console.log(
      `Attempting to find user with email: '${email}' and role: '${role}'`
    );
    const user = await User.findOne({ email, role });

    if (!user) {
      console.log(
        "Login attempt: User not found for provided email/role combination."
      );
      return res
        .status(401)
        .json({ error: "Invalid credentials (email/role mismatch)." });
    }

    // NEW: Check if the user has a password before attempting to match
    if (!user.password) {
      console.log(
        "Login attempt: User has no password (likely a Google user)."
      );
      return res
        .status(401)
        .json({ error: "Please use Google Sign-In for this account." });
    }

    console.log(`Login attempt: User found. Comparing passwords...`);
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      console.log("Login attempt: Password mismatch.");
      return res
        .status(401)
        .json({ error: "Invalid credentials (password mismatch)." });
    }

    console.log(`Login successful for user: ${user.email} (${user.role})`);

    const token = generateToken(user._id, user.role);

    res.json({
      message: "Login successful",
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
      profilePictureUrl: user.profilePictureUrl || null,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(err.message.includes("required") ? 400 : 500).json({
      error: err.message || "Login failed due to server error.",
    });
  }
};

// @desc    Google OAuth Login/Registration
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res) => {
  const { idToken, role } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: "Missing ID token" });
  }
  if (!role) {
    return res.status(400).json({ error: "Missing role" });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        googleId,
        email,
        name: name || "",
        username: email.split("@")[0].replace(/[^a-z0-9-]/g, ""),
        profilePictureUrl: picture || "",
        isProfileComplete: false,
        role,
      });
      await user.save();
    } else if (!user.googleId) {
      user.googleId = googleId;
      user.profilePictureUrl = picture || user.profilePictureUrl;
      await user.save();
    }

    if (user.role !== role) {
      return res
        .status(400)
        .json({
          error: `User with email ${email} is already registered as a ${user.role}.`,
        });
    }

    const sessionToken = generateToken(user._id, user.role);

    res.status(200).json({
      message: "Google login successful",
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: sessionToken,
      profilePictureUrl: user.profilePictureUrl || null,
      isProfileComplete: user.isProfileComplete,
    });
  } catch (error) {
    console.error("Google OAuth verification failed:", error);
    res.status(401).json({ error: "Authentication failed" });
  }
};

// @desc    Send OTP for password reset
// @route   POST /api/auth/send-otp
// @access  Public
const sendOtp = async (req, res) => {
  try {
    validateInput(req.body, ["email"]);

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(200).json({
        message: "If an account with that email exists, an OTP has been sent.",
      });
    }

    if (
      user.otp &&
      user.otp.expiresAt &&
      user.otp.expiresAt.getTime() > Date.now()
    ) {
      const timeSinceLastOtp =
        (user.otp.expiresAt.getTime() - Date.now()) / 1000;
      if (timeSinceLastOtp > 240) {
        return res.status(429).json({
          error: `Please wait ${Math.ceil(
            timeSinceLastOtp - 240
          )} seconds before requesting another OTP.`,
        });
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 300000;

    user.otp = { code: otp, expiresAt: new Date(expiresAt) };
    await user.save();

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
      .json({ error: "Failed to send OTP. Please try again later." });
  }
};

// @desc    Reset Password with OTP
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    validateInput(req.body, ["email", "otp", "newPassword"]);

    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ error: "Invalid request (user not found for email)." });
    }

    if (!user.otp || user.otp.code !== otp) {
      return res.status(400).json({ error: "Invalid or incorrect OTP code." });
    }

    if (user.otp.expiresAt < new Date()) {
      user.otp = undefined;
      await user.save();
      return res
        .status(400)
        .json({ error: "OTP expired. Please request a new one." });
    }

    user.password = newPassword;
    user.otp = undefined;
    await user.save();

    res.json({ message: "Password reset successful!" });
  } catch (err) {
    console.error("Reset Password error:", err);
    res
      .status(500)
      .json({ error: "Failed to reset password. Please try again later." });
  }
};

// @desc    Get current authenticated user's profile
// @route   GET /api/auth/profile
// @access  Private (requires 'protect' middleware)
const getUserProfile = async (req, res) => {
  if (req.user) {
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

// @desc    Update current authenticated user's profile
// @route   PUT /api/auth/profile
// @access  Private (requires 'protect' middleware)
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
    user.address = req.body.address || user.address;

    if (req.body.currentPassword && req.body.newPassword) {
      const isMatch = await user.matchPassword(req.body.currentPassword);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect." });
      }
      user.password = req.body.newPassword;
    } else if (req.body.newPassword) {
      return res
        .status(400)
        .json({ message: "Current password is required to change password." });
    }

    const updatedUser = await user.save();
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
      token,
    });
  } else {
    res.status(404).json({ message: "User not found." });
  }
};
// @desc    Complete user profile after initial Google signup
// @route   POST /api/auth/complete-profile
// @access  Private (requires JWT auth)
const completeUserProfile = async (req, res) => {
  const { userId } = req.user;
  const { role, phoneNumber, hostelName, hostelLocation } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    user.role = role;
    user.phoneNumber = phoneNumber;
    user.isProfileComplete = true;

    if (role === "hostel owner") {
      user.hostelName = hostelName;
      user.hostelLocation = hostelLocation;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile updated successfully.",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        isProfileComplete: updatedUser.isProfileComplete,
        phoneNumber: updatedUser.phoneNumber,
        hostelName: updatedUser.hostelName,
        hostelLocation: updatedUser.hostelLocation,
      },
    });
  } catch (error) {
    console.error("Error completing user profile:", error);
    res.status(500).json({ error: "Failed to update profile." });
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleLogin,
  sendOtp,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  completeUserProfile,
};
