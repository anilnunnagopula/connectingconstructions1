// server/controllers/authController.js
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const { sendPasswordResetEmail } = require("../utils/sendEmail");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/tokenUtils");
const {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} = require("../utils/cookieUtils");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const { OAuth2Client } = require("google-auth-library");
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// ===== HELPER FUNCTIONS =====

// Generate both access and refresh tokens
const generateTokens = async (userId, role, req, res) => {
  // Generate access token (15 min)
  const accessToken = generateAccessToken(userId, role);

  // Generate refresh token (7 days)
  const { token: refreshToken, tokenId } = generateRefreshToken(userId);

  // Save refresh token to database
  await RefreshToken.create({
    userId,
    tokenId,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    deviceInfo: {
      userAgent: req.headers["user-agent"],
      ip: req.ip || req.connection.remoteAddress,
    },
  });

  // Set refresh token as httpOnly cookie
  setRefreshTokenCookie(res, refreshToken);

  return accessToken;
};

// Basic input validation
const validateInput = (data, fields) => {
  for (const field of fields) {
    if (!data[field] || String(data[field]).trim() === "") {
      throw new Error(`${field} is required`);
    }
  }
};

// ===== PUBLIC ROUTES =====

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res) => {
  try {
    console.log("📝 Registration request:", req.body.email);
    const { role, email, password, name, username } = req.body;

    validateInput(req.body, ["role", "email", "password", "name", "username"]);

    // Check for existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    }).maxTimeMS(10000);

    if (existingUser) {
      const field = existingUser.email === email ? "Email" : "Username";
      return res.status(400).json({
        success: false,
        error: `${field} already exists.`,
      });
    }

    // Create new user
    const newUser = new User({ role, email, password, name, username });
    await newUser.save();

    // Generate tokens
    const token = await generateTokens(newUser._id, newUser.role, req, res);

    console.log("✅ User registered:", newUser.email);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      username: newUser.username,
      token, // Access token
      profilePictureUrl: newUser.profilePictureUrl || null,
    });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(err.message.includes("required") ? 400 : 500).json({
      success: false,
      error: err.message || "Registration failed due to server error.",
    });
  }
};

/**
 * @desc    Login User
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res) => {
  try {
    console.log("🔐 Login request:", req.body.email);
    const { email, password, role } = req.body;

    validateInput(req.body, ["email", "password", "role"]);

    // Find user (email is unique, so we don't strictly need role for lookup)
    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(401).json({
        success: false,
        error: "Invalid credentials.",
      });
    }

    // Check if user has password (OAuth users don't)
    if (!user.password) {
      console.log("❌ Google user attempting password login:", email);
      return res.status(401).json({
        success: false,
        error: "Please use Google Sign-In for this account.",
      });
    }

    // Verify password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      console.log("❌ Password mismatch:", email);
      return res.status(401).json({
        success: false,
        error: "Invalid credentials (password mismatch).",
      });
    }

    // Generate tokens
    const token = await generateTokens(user._id, user.role, req, res);

    console.log("✅ Login successful:", user.email);

    res.json({
      success: true,
      message: "Login successful",
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      username: user.username,
      token, // Access token (refresh token is in httpOnly cookie)
      profilePictureUrl: user.profilePictureUrl || null,
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(err.message.includes("required") ? 400 : 500).json({
      success: false,
      error: err.message || "Login failed due to server error.",
    });
  }
};

/**
 * @desc    Google OAuth Login/Registration
 * @route   POST /api/auth/google
 * @access  Public
 */
const googleLogin = async (req, res) => {
  const { idToken, role } = req.body;

  if (!idToken) {
    return res.status(400).json({
      success: false,
      error: "Missing ID token",
    });
  }
  if (!role) {
    return res.status(400).json({
      success: false,
      error: "Missing role",
    });
  }

  try {
    // Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    console.log("🔐 Google login:", email);

    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user with unique username
      const baseUsername = email.split("@")[0].replace(/[^a-z0-9]/gi, "");
      const uniqueSuffix = Date.now().toString().slice(-4);

      user = new User({
        googleId,
        email,
        name: name || "",
        username: `${baseUsername}_${uniqueSuffix}`,
        profilePictureUrl: picture || "",
        isProfileComplete: false,
        role,
      });

      await user.save();
      console.log("✅ New Google user created:", email);
    } else {
      // 🔥 GUARANTEE USERNAME EXISTS
      if (!user.username) {
        const baseUsername = email.split("@")[0].replace(/[^a-z0-9]/gi, "");
        const uniqueSuffix = Date.now().toString().slice(-4);
        user.username = `${baseUsername}_${uniqueSuffix}`;
      }

      if (!user.googleId) {
        user.googleId = googleId;
      }

      user.profilePictureUrl = picture || user.profilePictureUrl;

      await user.save();
      console.log("✅ Google account linked:", email);
    }


    // Check role match
    if (user.role !== role) {
      return res.status(400).json({
        success: false,
        error: `User with email ${email} is already registered as a ${user.role}.`,
      });
    }

    // Generate tokens
    const sessionToken = await generateTokens(user._id, user.role, req, res);

    console.log("✅ Google login successful:", user.email);

    res.status(200).json({
      success: true,
      message: "Google login successful",
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      username: user.username,
      token: sessionToken,
      profilePictureUrl: user.profilePictureUrl || null,
      isProfileComplete: user.isProfileComplete,
    });
  } catch (error) {
    console.error("❌ Google OAuth error:", error.message);
    res.status(401).json({
      success: false,
      error: "Authentication failed",
    });
  }
};

/**
 * @desc    Refresh Access Token
 * @route   POST /api/auth/refresh
 * @access  Public (requires refresh token cookie)
 */
const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "No refresh token provided",
      });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Check if token exists in database and is not revoked
    const storedToken = await RefreshToken.findOne({
      token: refreshToken,
      userId: decoded.id,
      isRevoked: false,
    });

    if (!storedToken) {
      clearRefreshTokenCookie(res);
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // Check if token is expired
    if (storedToken.expiresAt < Date.now()) {
      await RefreshToken.deleteOne({ _id: storedToken._id });
      clearRefreshTokenCookie(res);
      return res.status(401).json({
        success: false,
        message: "Refresh token expired",
      });
    }

    // Get user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user._id, user.role);

    console.log("♻️  Token refreshed:", user.email);

    res.status(200).json({
      success: true,
      token: newAccessToken,
    });
  } catch (error) {
    console.error("❌ Refresh token error:", error);
    clearRefreshTokenCookie(res);
    return res.status(401).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
};

/**
 * @desc    Logout (revoke refresh token)
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      // Revoke the refresh token
      await RefreshToken.updateOne(
        { token: refreshToken },
        { isRevoked: true },
      );
    }

    // Clear cookie
    clearRefreshTokenCookie(res);

    console.log("👋 User logged out");

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("❌ Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};

/**
 * @desc    Logout from all devices
 * @route   POST /api/auth/logout-all
 * @access  Private
 */
const logoutAllDevices = async (req, res) => {
  try {
    // Revoke all refresh tokens for this user
    await RefreshToken.updateMany(
      { userId: req.user._id, isRevoked: false },
      { isRevoked: true },
    );

    // Clear cookie
    clearRefreshTokenCookie(res);

    console.log("👋 User logged out from all devices");

    res.status(200).json({
      success: true,
      message: "Logged out from all devices",
    });
  } catch (error) {
    console.error("❌ Logout all error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to logout from all devices",
    });
  }
};

/**
 * @desc    Forgot Password - Send Reset Link
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email",
      });
    }

    // Generate reset token
    const resetToken = user.getResetPasswordToken();

    // Save without validation
    await user.save({ validateBeforeSave: false });

    try {
      await sendPasswordResetEmail(user, resetToken);

      console.log("📧 Password reset email sent:", email);

      res.status(200).json({
        success: true,
        message: "Password reset email sent successfully",
      });
    } catch (error) {
      // Rollback token if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      console.error("❌ Email send failed:", error);

      return res.status(500).json({
        success: false,
        message: "Email could not be sent",
      });
    }
  } catch (error) {
    console.error("❌ Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Reset Password
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    // Hash token from URL
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    console.log("✅ Password reset successful:", user.email);

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("❌ Reset password error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Verify Reset Token
 * @route   GET /api/auth/verify-reset-token/:token
 * @access  Public
 */
const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    res.status(200).json({
      success: true,
      message: "Token is valid",
    });
  } catch (error) {
    console.error("❌ Verify token error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===== PROTECTED ROUTES =====

/**
 * @desc    Get current user's profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
      address: user.address,
      profilePictureUrl: user.profilePictureUrl,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("❌ Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

/**
 * @desc    Update current user's profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update fields
    user.name = req.body.name || user.name;
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
    user.address = req.body.address || user.address;

    // Handle password change
    if (req.body.currentPassword && req.body.newPassword) {
      const isMatch = await user.matchPassword(req.body.currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        });
      }
      user.password = req.body.newPassword;
    } else if (req.body.newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password is required to change password",
      });
    }

    const updatedUser = await user.save();

    // Generate new token with updated info
    const token = generateAccessToken(updatedUser._id, updatedUser.role);

    console.log("✅ Profile updated:", updatedUser.email);

    res.json({
      success: true,
      message: "Profile updated successfully",
      _id: updatedUser._id,
      name: updatedUser.name,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      phoneNumber: updatedUser.phoneNumber,
      address: updatedUser.address,
      token,
    });
  } catch (error) {
    console.error("❌ Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};
/**
 * @desc    Complete user profile after Google signup
 * @route   POST /api/auth/complete-profile
 * @access  Private
 */
const completeUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
    user.address = req.body.address || user.address;
    user.isProfileComplete = true;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "Profile completed successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        username: updatedUser.username,
        isProfileComplete: updatedUser.isProfileComplete,
      },
    });
  } catch (error) {
    console.error("❌ Complete profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to complete profile",
    });
  }
};


module.exports = {
  registerUser,
  loginUser,
  googleLogin,
  refreshAccessToken,
  logoutUser,
  logoutAllDevices,
  forgotPassword,
  resetPassword,
  verifyResetToken,
  getUserProfile,
  updateUserProfile,
  completeUserProfile,
};
