"use strict";

// server/utils/tokenUtils.js
var jwt = require("jsonwebtoken");

var crypto = require("crypto"); // Generate Access Token (short-lived: 15 minutes)


var generateAccessToken = function generateAccessToken(userId, role) {
  return jwt.sign({
    id: userId,
    role: role
  }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
}; // Generate Refresh Token (long-lived: 7 days)


var generateRefreshToken = function generateRefreshToken(userId) {
  var token = jwt.sign({
    id: userId,
    type: "refresh"
  }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "15d"
  }); // Generate a unique token ID for tracking

  var tokenId = crypto.randomBytes(16).toString("hex");
  return {
    token: token,
    tokenId: tokenId
  };
}; // Verify Access Token


var verifyAccessToken = function verifyAccessToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired access token");
  }
}; // Verify Refresh Token


var verifyRefreshToken = function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};

module.exports = {
  generateAccessToken: generateAccessToken,
  generateRefreshToken: generateRefreshToken,
  verifyAccessToken: verifyAccessToken,
  verifyRefreshToken: verifyRefreshToken
};