"use strict";

// server/models/RefreshToken.js
var mongoose = require("mongoose");

var refreshTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  tokenId: {
    type: String,
    required: true,
    unique: true
  },
  token: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: {
      expires: 0
    } // Auto-delete expired tokens

  },
  deviceInfo: {
    userAgent: String,
    ip: String
  },
  isRevoked: {
    type: Boolean,
    "default": false
  }
}, {
  timestamps: true
}); // Index for faster lookups

refreshTokenSchema.index({
  userId: 1,
  isRevoked: 1
});
refreshTokenSchema.index({
  tokenId: 1
});
module.exports = mongoose.model("RefreshToken", refreshTokenSchema);