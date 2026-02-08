"use strict";

// server/controllers/authController.js
var User = require("../models/User");

var RefreshToken = require("../models/RefreshToken");

var _require = require("../utils/sendEmail"),
    sendPasswordResetEmail = _require.sendPasswordResetEmail;

var _require2 = require("../utils/tokenUtils"),
    generateAccessToken = _require2.generateAccessToken,
    generateRefreshToken = _require2.generateRefreshToken,
    verifyRefreshToken = _require2.verifyRefreshToken;

var _require3 = require("../utils/cookieUtils"),
    setRefreshTokenCookie = _require3.setRefreshTokenCookie,
    clearRefreshTokenCookie = _require3.clearRefreshTokenCookie;

var jwt = require("jsonwebtoken");

var crypto = require("crypto");

var _require4 = require("google-auth-library"),
    OAuth2Client = _require4.OAuth2Client;

var GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
var client = new OAuth2Client(GOOGLE_CLIENT_ID); // ===== HELPER FUNCTIONS =====
// Generate both access and refresh tokens

var generateTokens = function generateTokens(userId, role, req, res) {
  var accessToken, _generateRefreshToken, refreshToken, tokenId;

  return regeneratorRuntime.async(function generateTokens$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // Generate access token (15 min)
          accessToken = generateAccessToken(userId, role); // Generate refresh token (7 days)

          _generateRefreshToken = generateRefreshToken(userId), refreshToken = _generateRefreshToken.token, tokenId = _generateRefreshToken.tokenId; // Save refresh token to database

          _context.next = 4;
          return regeneratorRuntime.awrap(RefreshToken.create({
            userId: userId,
            tokenId: tokenId,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            deviceInfo: {
              userAgent: req.headers["user-agent"],
              ip: req.ip || req.connection.remoteAddress
            }
          }));

        case 4:
          // Set refresh token as httpOnly cookie
          setRefreshTokenCookie(res, refreshToken);
          return _context.abrupt("return", accessToken);

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
}; // Basic input validation


var validateInput = function validateInput(data, fields) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = fields[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var field = _step.value;

      if (!data[field] || String(data[field]).trim() === "") {
        throw new Error("".concat(field, " is required"));
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}; // ===== PUBLIC ROUTES =====

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */


var registerUser = function registerUser(req, res) {
  var _req$body, role, email, password, name, username, existingUser, field, newUser, token;

  return regeneratorRuntime.async(function registerUser$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          console.log("📝 Registration request:", req.body.email);
          _req$body = req.body, role = _req$body.role, email = _req$body.email, password = _req$body.password, name = _req$body.name, username = _req$body.username;
          validateInput(req.body, ["role", "email", "password", "name", "username"]); // Check for existing user

          _context2.next = 6;
          return regeneratorRuntime.awrap(User.findOne({
            $or: [{
              email: email
            }, {
              username: username
            }]
          }).maxTimeMS(10000));

        case 6:
          existingUser = _context2.sent;

          if (!existingUser) {
            _context2.next = 10;
            break;
          }

          field = existingUser.email === email ? "Email" : "Username";
          return _context2.abrupt("return", res.status(400).json({
            success: false,
            error: "".concat(field, " already exists.")
          }));

        case 10:
          // Create new user
          newUser = new User({
            role: role,
            email: email,
            password: password,
            name: name,
            username: username
          });
          _context2.next = 13;
          return regeneratorRuntime.awrap(newUser.save());

        case 13:
          _context2.next = 15;
          return regeneratorRuntime.awrap(generateTokens(newUser._id, newUser.role, req, res));

        case 15:
          token = _context2.sent;
          console.log("✅ User registered:", newUser.email);
          res.status(201).json({
            success: true,
            message: "Registration successful",
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            username: newUser.username,
            token: token,
            // Access token
            profilePictureUrl: newUser.profilePictureUrl || null
          });
          _context2.next = 24;
          break;

        case 20:
          _context2.prev = 20;
          _context2.t0 = _context2["catch"](0);
          console.error("❌ Registration error:", _context2.t0);
          res.status(_context2.t0.message.includes("required") ? 400 : 500).json({
            success: false,
            error: _context2.t0.message || "Registration failed due to server error."
          });

        case 24:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 20]]);
};
/**
 * @desc    Login User
 * @route   POST /api/auth/login
 * @access  Public
 */


var loginUser = function loginUser(req, res) {
  var _req$body2, email, password, role, user, isMatch, token;

  return regeneratorRuntime.async(function loginUser$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          console.log("🔐 Login request:", req.body.email);
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password, role = _req$body2.role;
          validateInput(req.body, ["email", "password", "role"]); // Find user

          _context3.next = 6;
          return regeneratorRuntime.awrap(User.findOne({
            email: email,
            role: role
          }));

        case 6:
          user = _context3.sent;

          if (user) {
            _context3.next = 10;
            break;
          }

          console.log("❌ User not found:", email);
          return _context3.abrupt("return", res.status(401).json({
            success: false,
            error: "Invalid credentials (email/role mismatch)."
          }));

        case 10:
          if (user.password) {
            _context3.next = 13;
            break;
          }

          console.log("❌ Google user attempting password login:", email);
          return _context3.abrupt("return", res.status(401).json({
            success: false,
            error: "Please use Google Sign-In for this account."
          }));

        case 13:
          _context3.next = 15;
          return regeneratorRuntime.awrap(user.matchPassword(password));

        case 15:
          isMatch = _context3.sent;

          if (isMatch) {
            _context3.next = 19;
            break;
          }

          console.log("❌ Password mismatch:", email);
          return _context3.abrupt("return", res.status(401).json({
            success: false,
            error: "Invalid credentials (password mismatch)."
          }));

        case 19:
          _context3.next = 21;
          return regeneratorRuntime.awrap(generateTokens(user._id, user.role, req, res));

        case 21:
          token = _context3.sent;
          console.log("✅ Login successful:", user.email);
          res.json({
            success: true,
            message: "Login successful",
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            username: user.username,
            token: token,
            // Access token (refresh token is in httpOnly cookie)
            profilePictureUrl: user.profilePictureUrl || null
          });
          _context3.next = 30;
          break;

        case 26:
          _context3.prev = 26;
          _context3.t0 = _context3["catch"](0);
          console.error("❌ Login error:", _context3.t0);
          res.status(_context3.t0.message.includes("required") ? 400 : 500).json({
            success: false,
            error: _context3.t0.message || "Login failed due to server error."
          });

        case 30:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 26]]);
};
/**
 * @desc    Google OAuth Login/Registration
 * @route   POST /api/auth/google
 * @access  Public
 */


var googleLogin = function googleLogin(req, res) {
  var _req$body3, idToken, role, ticket, payload, googleId, email, name, picture, user, baseUsername, uniqueSuffix, _baseUsername, _uniqueSuffix, sessionToken;

  return regeneratorRuntime.async(function googleLogin$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$body3 = req.body, idToken = _req$body3.idToken, role = _req$body3.role;

          if (idToken) {
            _context4.next = 3;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            success: false,
            error: "Missing ID token"
          }));

        case 3:
          if (role) {
            _context4.next = 5;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            success: false,
            error: "Missing role"
          }));

        case 5:
          _context4.prev = 5;
          _context4.next = 8;
          return regeneratorRuntime.awrap(client.verifyIdToken({
            idToken: idToken,
            audience: GOOGLE_CLIENT_ID
          }));

        case 8:
          ticket = _context4.sent;
          payload = ticket.getPayload();
          googleId = payload.sub, email = payload.email, name = payload.name, picture = payload.picture;
          console.log("🔐 Google login:", email); // Find or create user

          _context4.next = 14;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 14:
          user = _context4.sent;

          if (user) {
            _context4.next = 24;
            break;
          }

          // Create new user with unique username
          baseUsername = email.split("@")[0].replace(/[^a-z0-9]/gi, "");
          uniqueSuffix = Date.now().toString().slice(-4);
          user = new User({
            googleId: googleId,
            email: email,
            name: name || "",
            username: "".concat(baseUsername, "_").concat(uniqueSuffix),
            profilePictureUrl: picture || "",
            isProfileComplete: false,
            role: role
          });
          _context4.next = 21;
          return regeneratorRuntime.awrap(user.save());

        case 21:
          console.log("✅ New Google user created:", email);
          _context4.next = 30;
          break;

        case 24:
          // 🔥 GUARANTEE USERNAME EXISTS
          if (!user.username) {
            _baseUsername = email.split("@")[0].replace(/[^a-z0-9]/gi, "");
            _uniqueSuffix = Date.now().toString().slice(-4);
            user.username = "".concat(_baseUsername, "_").concat(_uniqueSuffix);
          }

          if (!user.googleId) {
            user.googleId = googleId;
          }

          user.profilePictureUrl = picture || user.profilePictureUrl;
          _context4.next = 29;
          return regeneratorRuntime.awrap(user.save());

        case 29:
          console.log("✅ Google account linked:", email);

        case 30:
          if (!(user.role !== role)) {
            _context4.next = 32;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            success: false,
            error: "User with email ".concat(email, " is already registered as a ").concat(user.role, ".")
          }));

        case 32:
          _context4.next = 34;
          return regeneratorRuntime.awrap(generateTokens(user._id, user.role, req, res));

        case 34:
          sessionToken = _context4.sent;
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
            isProfileComplete: user.isProfileComplete
          });
          _context4.next = 43;
          break;

        case 39:
          _context4.prev = 39;
          _context4.t0 = _context4["catch"](5);
          console.error("❌ Google OAuth error:", _context4.t0.message);
          res.status(401).json({
            success: false,
            error: "Authentication failed"
          });

        case 43:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[5, 39]]);
};
/**
 * @desc    Refresh Access Token
 * @route   POST /api/auth/refresh
 * @access  Public (requires refresh token cookie)
 */


var refreshAccessToken = function refreshAccessToken(req, res) {
  var refreshToken, decoded, storedToken, user, newAccessToken;
  return regeneratorRuntime.async(function refreshAccessToken$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          refreshToken = req.cookies.refreshToken;

          if (refreshToken) {
            _context5.next = 4;
            break;
          }

          return _context5.abrupt("return", res.status(401).json({
            success: false,
            message: "No refresh token provided"
          }));

        case 4:
          // Verify refresh token
          decoded = verifyRefreshToken(refreshToken); // Check if token exists in database and is not revoked

          _context5.next = 7;
          return regeneratorRuntime.awrap(RefreshToken.findOne({
            token: refreshToken,
            userId: decoded.id,
            isRevoked: false
          }));

        case 7:
          storedToken = _context5.sent;

          if (storedToken) {
            _context5.next = 11;
            break;
          }

          clearRefreshTokenCookie(res);
          return _context5.abrupt("return", res.status(401).json({
            success: false,
            message: "Invalid refresh token"
          }));

        case 11:
          if (!(storedToken.expiresAt < Date.now())) {
            _context5.next = 16;
            break;
          }

          _context5.next = 14;
          return regeneratorRuntime.awrap(RefreshToken.deleteOne({
            _id: storedToken._id
          }));

        case 14:
          clearRefreshTokenCookie(res);
          return _context5.abrupt("return", res.status(401).json({
            success: false,
            message: "Refresh token expired"
          }));

        case 16:
          _context5.next = 18;
          return regeneratorRuntime.awrap(User.findById(decoded.id));

        case 18:
          user = _context5.sent;

          if (user) {
            _context5.next = 21;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            success: false,
            message: "User not found"
          }));

        case 21:
          // Generate new access token
          newAccessToken = generateAccessToken(user._id, user.role);
          console.log("♻️  Token refreshed:", user.email);
          res.status(200).json({
            success: true,
            token: newAccessToken
          });
          _context5.next = 31;
          break;

        case 26:
          _context5.prev = 26;
          _context5.t0 = _context5["catch"](0);
          console.error("❌ Refresh token error:", _context5.t0);
          clearRefreshTokenCookie(res);
          return _context5.abrupt("return", res.status(401).json({
            success: false,
            message: "Invalid refresh token"
          }));

        case 31:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 26]]);
};
/**
 * @desc    Logout (revoke refresh token)
 * @route   POST /api/auth/logout
 * @access  Private
 */


var logoutUser = function logoutUser(req, res) {
  var refreshToken;
  return regeneratorRuntime.async(function logoutUser$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          refreshToken = req.cookies.refreshToken;

          if (!refreshToken) {
            _context6.next = 5;
            break;
          }

          _context6.next = 5;
          return regeneratorRuntime.awrap(RefreshToken.updateOne({
            token: refreshToken
          }, {
            isRevoked: true
          }));

        case 5:
          // Clear cookie
          clearRefreshTokenCookie(res);
          console.log("👋 User logged out");
          res.status(200).json({
            success: true,
            message: "Logged out successfully"
          });
          _context6.next = 14;
          break;

        case 10:
          _context6.prev = 10;
          _context6.t0 = _context6["catch"](0);
          console.error("❌ Logout error:", _context6.t0);
          res.status(500).json({
            success: false,
            message: "Logout failed"
          });

        case 14:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 10]]);
};
/**
 * @desc    Logout from all devices
 * @route   POST /api/auth/logout-all
 * @access  Private
 */


var logoutAllDevices = function logoutAllDevices(req, res) {
  return regeneratorRuntime.async(function logoutAllDevices$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(RefreshToken.updateMany({
            userId: req.user._id,
            isRevoked: false
          }, {
            isRevoked: true
          }));

        case 3:
          // Clear cookie
          clearRefreshTokenCookie(res);
          console.log("👋 User logged out from all devices");
          res.status(200).json({
            success: true,
            message: "Logged out from all devices"
          });
          _context7.next = 12;
          break;

        case 8:
          _context7.prev = 8;
          _context7.t0 = _context7["catch"](0);
          console.error("❌ Logout all error:", _context7.t0);
          res.status(500).json({
            success: false,
            message: "Failed to logout from all devices"
          });

        case 12:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 8]]);
};
/**
 * @desc    Forgot Password - Send Reset Link
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */


var forgotPassword = function forgotPassword(req, res) {
  var email, user, resetToken;
  return regeneratorRuntime.async(function forgotPassword$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          email = req.body.email;
          _context8.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 4:
          user = _context8.sent;

          if (user) {
            _context8.next = 7;
            break;
          }

          return _context8.abrupt("return", res.status(404).json({
            success: false,
            message: "User not found with this email"
          }));

        case 7:
          // Generate reset token
          resetToken = user.getResetPasswordToken(); // Save without validation

          _context8.next = 10;
          return regeneratorRuntime.awrap(user.save({
            validateBeforeSave: false
          }));

        case 10:
          _context8.prev = 10;
          _context8.next = 13;
          return regeneratorRuntime.awrap(sendPasswordResetEmail(user, resetToken));

        case 13:
          console.log("📧 Password reset email sent:", email);
          res.status(200).json({
            success: true,
            message: "Password reset email sent successfully"
          });
          _context8.next = 25;
          break;

        case 17:
          _context8.prev = 17;
          _context8.t0 = _context8["catch"](10);
          // Rollback token if email fails
          user.resetPasswordToken = undefined;
          user.resetPasswordExpire = undefined;
          _context8.next = 23;
          return regeneratorRuntime.awrap(user.save({
            validateBeforeSave: false
          }));

        case 23:
          console.error("❌ Email send failed:", _context8.t0);
          return _context8.abrupt("return", res.status(500).json({
            success: false,
            message: "Email could not be sent"
          }));

        case 25:
          _context8.next = 31;
          break;

        case 27:
          _context8.prev = 27;
          _context8.t1 = _context8["catch"](0);
          console.error("❌ Forgot password error:", _context8.t1);
          res.status(500).json({
            success: false,
            message: _context8.t1.message
          });

        case 31:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 27], [10, 17]]);
};
/**
 * @desc    Reset Password
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */


var resetPassword = function resetPassword(req, res) {
  var token, password, resetPasswordToken, user;
  return regeneratorRuntime.async(function resetPassword$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          token = req.params.token;
          password = req.body.password;

          if (password) {
            _context9.next = 5;
            break;
          }

          return _context9.abrupt("return", res.status(400).json({
            success: false,
            message: "Password is required"
          }));

        case 5:
          // Hash token from URL
          resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
          _context9.next = 8;
          return regeneratorRuntime.awrap(User.findOne({
            resetPasswordToken: resetPasswordToken,
            resetPasswordExpire: {
              $gt: Date.now()
            }
          }));

        case 8:
          user = _context9.sent;

          if (user) {
            _context9.next = 11;
            break;
          }

          return _context9.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid or expired token"
          }));

        case 11:
          // Set new password
          user.password = password;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpire = undefined;
          _context9.next = 16;
          return regeneratorRuntime.awrap(user.save({
            validateBeforeSave: false
          }));

        case 16:
          console.log("✅ Password reset successful:", user.email);
          res.status(200).json({
            success: true,
            message: "Password updated successfully"
          });
          _context9.next = 24;
          break;

        case 20:
          _context9.prev = 20;
          _context9.t0 = _context9["catch"](0);
          console.error("❌ Reset password error:", _context9.t0);
          res.status(500).json({
            success: false,
            message: _context9.t0.message
          });

        case 24:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 20]]);
};
/**
 * @desc    Verify Reset Token
 * @route   GET /api/auth/verify-reset-token/:token
 * @access  Public
 */


var verifyResetToken = function verifyResetToken(req, res) {
  var token, resetPasswordToken, user;
  return regeneratorRuntime.async(function verifyResetToken$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          token = req.params.token;
          resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
          _context10.next = 5;
          return regeneratorRuntime.awrap(User.findOne({
            resetPasswordToken: resetPasswordToken,
            resetPasswordExpire: {
              $gt: Date.now()
            }
          }));

        case 5:
          user = _context10.sent;

          if (user) {
            _context10.next = 8;
            break;
          }

          return _context10.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid or expired token"
          }));

        case 8:
          res.status(200).json({
            success: true,
            message: "Token is valid"
          });
          _context10.next = 15;
          break;

        case 11:
          _context10.prev = 11;
          _context10.t0 = _context10["catch"](0);
          console.error("❌ Verify token error:", _context10.t0);
          res.status(500).json({
            success: false,
            message: _context10.t0.message
          });

        case 15:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 11]]);
}; // ===== PROTECTED ROUTES =====

/**
 * @desc    Get current user's profile
 * @route   GET /api/auth/profile
 * @access  Private
 */


var getUserProfile = function getUserProfile(req, res) {
  var user;
  return regeneratorRuntime.async(function getUserProfile$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          _context11.next = 3;
          return regeneratorRuntime.awrap(User.findById(req.user._id).select("-password"));

        case 3:
          user = _context11.sent;

          if (user) {
            _context11.next = 6;
            break;
          }

          return _context11.abrupt("return", res.status(404).json({
            success: false,
            message: "User not found"
          }));

        case 6:
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
            createdAt: user.createdAt
          });
          _context11.next = 13;
          break;

        case 9:
          _context11.prev = 9;
          _context11.t0 = _context11["catch"](0);
          console.error("❌ Get profile error:", _context11.t0);
          res.status(500).json({
            success: false,
            message: "Failed to fetch profile"
          });

        case 13:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 9]]);
};
/**
 * @desc    Update current user's profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */


var updateUserProfile = function updateUserProfile(req, res) {
  var user, isMatch, updatedUser, token;
  return regeneratorRuntime.async(function updateUserProfile$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          _context12.next = 3;
          return regeneratorRuntime.awrap(User.findById(req.user._id));

        case 3:
          user = _context12.sent;

          if (user) {
            _context12.next = 6;
            break;
          }

          return _context12.abrupt("return", res.status(404).json({
            success: false,
            message: "User not found"
          }));

        case 6:
          // Update fields
          user.name = req.body.name || user.name;
          user.username = req.body.username || user.username;
          user.email = req.body.email || user.email;
          user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
          user.address = req.body.address || user.address; // Handle password change

          if (!(req.body.currentPassword && req.body.newPassword)) {
            _context12.next = 20;
            break;
          }

          _context12.next = 14;
          return regeneratorRuntime.awrap(user.matchPassword(req.body.currentPassword));

        case 14:
          isMatch = _context12.sent;

          if (isMatch) {
            _context12.next = 17;
            break;
          }

          return _context12.abrupt("return", res.status(400).json({
            success: false,
            message: "Current password is incorrect"
          }));

        case 17:
          user.password = req.body.newPassword;
          _context12.next = 22;
          break;

        case 20:
          if (!req.body.newPassword) {
            _context12.next = 22;
            break;
          }

          return _context12.abrupt("return", res.status(400).json({
            success: false,
            message: "Current password is required to change password"
          }));

        case 22:
          _context12.next = 24;
          return regeneratorRuntime.awrap(user.save());

        case 24:
          updatedUser = _context12.sent;
          // Generate new token with updated info
          token = generateAccessToken(updatedUser._id, updatedUser.role);
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
            token: token
          });
          _context12.next = 34;
          break;

        case 30:
          _context12.prev = 30;
          _context12.t0 = _context12["catch"](0);
          console.error("❌ Update profile error:", _context12.t0);
          res.status(500).json({
            success: false,
            message: "Failed to update profile"
          });

        case 34:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[0, 30]]);
};
/**
 * @desc    Complete user profile after Google signup
 * @route   POST /api/auth/complete-profile
 * @access  Private
 */


var completeUserProfile = function completeUserProfile(req, res) {
  var user, updatedUser;
  return regeneratorRuntime.async(function completeUserProfile$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          _context13.next = 3;
          return regeneratorRuntime.awrap(User.findById(req.user._id));

        case 3:
          user = _context13.sent;

          if (user) {
            _context13.next = 6;
            break;
          }

          return _context13.abrupt("return", res.status(404).json({
            success: false,
            message: "User not found"
          }));

        case 6:
          user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
          user.address = req.body.address || user.address;
          user.isProfileComplete = true;
          _context13.next = 11;
          return regeneratorRuntime.awrap(user.save());

        case 11:
          updatedUser = _context13.sent;
          res.status(200).json({
            success: true,
            message: "Profile completed successfully",
            user: {
              _id: updatedUser._id,
              name: updatedUser.name,
              email: updatedUser.email,
              role: updatedUser.role,
              username: updatedUser.username,
              isProfileComplete: updatedUser.isProfileComplete
            }
          });
          _context13.next = 19;
          break;

        case 15:
          _context13.prev = 15;
          _context13.t0 = _context13["catch"](0);
          console.error("❌ Complete profile error:", _context13.t0);
          res.status(500).json({
            success: false,
            message: "Failed to complete profile"
          });

        case 19:
        case "end":
          return _context13.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

module.exports = {
  registerUser: registerUser,
  loginUser: loginUser,
  googleLogin: googleLogin,
  refreshAccessToken: refreshAccessToken,
  logoutUser: logoutUser,
  logoutAllDevices: logoutAllDevices,
  forgotPassword: forgotPassword,
  resetPassword: resetPassword,
  verifyResetToken: verifyResetToken,
  getUserProfile: getUserProfile,
  updateUserProfile: updateUserProfile,
  completeUserProfile: completeUserProfile
};