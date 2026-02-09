// server/utils/tokenUtils.js
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Generate Access Token (short-lived: 15 minutes)
const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }, 
  );
};

// Generate Refresh Token (long-lived: 7 days)
const generateRefreshToken = (userId) => {
  const token = jwt.sign(
    { id: userId, type: "refresh" },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "15d" },
  );

  // Generate a unique token ID for tracking
  const tokenId = crypto.randomBytes(16).toString("hex");

  return { token, tokenId };
};

// Verify Access Token
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired access token");
  }
};

// Verify Refresh Token
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
