"use strict";

var User = require("../models/User");

var sendEmail = require("../utils/sendEmail");

var jwt = require("jsonwebtoken");

var _require = require("google-auth-library"),
    OAuth2Client = _require.OAuth2Client;

var GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
var client = new OAuth2Client(GOOGLE_CLIENT_ID); // Helper function to generate a JWT token

var generateToken = function generateToken(id, role) {
  return jwt.sign({
    id: id,
    role: role
  }, process.env.JWT_SECRET, {
    expiresIn: "1h"
  });
}; // Helper function for basic validation


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
}; // @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public


var registerUser = function registerUser(req, res) {
  var _req$body, role, email, password, name, username, existingUser, field, newUser, token;

  return regeneratorRuntime.async(function registerUser$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          console.log("Incoming registration request:", req.body);
          _req$body = req.body, role = _req$body.role, email = _req$body.email, password = _req$body.password, name = _req$body.name, username = _req$body.username;
          validateInput(req.body, ["role", "email", "password", "name", "username"]);
          console.log("Checking for existing user...");
          _context.next = 7;
          return regeneratorRuntime.awrap(User.findOne({
            $or: [{
              email: email
            }, {
              username: username
            }]
          }).maxTimeMS(10000));

        case 7:
          existingUser = _context.sent;

          if (!existingUser) {
            _context.next = 11;
            break;
          }

          field = existingUser.email === email ? "Email" : "Username";
          return _context.abrupt("return", res.status(400).json({
            error: "".concat(field, " already exists.")
          }));

        case 11:
          console.log("Creating new user...");
          newUser = new User({
            role: role,
            email: email,
            password: password,
            name: name,
            username: username
          });
          _context.next = 15;
          return regeneratorRuntime.awrap(newUser.save());

        case 15:
          token = generateToken(newUser._id, newUser.role);
          res.status(201).json({
            message: "Registration successful",
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            token: token,
            profilePictureUrl: newUser.profilePictureUrl || null
          });
          _context.next = 23;
          break;

        case 19:
          _context.prev = 19;
          _context.t0 = _context["catch"](0);
          console.error("Registration error:", _context.t0);
          res.status(_context.t0.message.includes("required") ? 400 : 500).json({
            error: _context.t0.message || "Registration failed due to server error."
          });

        case 23:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 19]]);
}; // @desc    Login User
// @route   POST /api/auth/login
// @access  Public


var loginUser = function loginUser(req, res) {
  var _req$body2, email, password, role, user, isMatch, token;

  return regeneratorRuntime.async(function loginUser$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          console.log("Incoming login request:", req.body);
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password, role = _req$body2.role;
          validateInput(req.body, ["email", "password", "role"]);
          console.log("Attempting to find user with email: '".concat(email, "' and role: '").concat(role, "'"));
          _context2.next = 7;
          return regeneratorRuntime.awrap(User.findOne({
            email: email,
            role: role
          }));

        case 7:
          user = _context2.sent;

          if (user) {
            _context2.next = 11;
            break;
          }

          console.log("Login attempt: User not found for provided email/role combination.");
          return _context2.abrupt("return", res.status(401).json({
            error: "Invalid credentials (email/role mismatch)."
          }));

        case 11:
          if (user.password) {
            _context2.next = 14;
            break;
          }

          console.log("Login attempt: User has no password (likely a Google user).");
          return _context2.abrupt("return", res.status(401).json({
            error: "Please use Google Sign-In for this account."
          }));

        case 14:
          console.log("Login attempt: User found. Comparing passwords...");
          _context2.next = 17;
          return regeneratorRuntime.awrap(user.matchPassword(password));

        case 17:
          isMatch = _context2.sent;

          if (isMatch) {
            _context2.next = 21;
            break;
          }

          console.log("Login attempt: Password mismatch.");
          return _context2.abrupt("return", res.status(401).json({
            error: "Invalid credentials (password mismatch)."
          }));

        case 21:
          console.log("Login successful for user: ".concat(user.email, " (").concat(user.role, ")"));
          token = generateToken(user._id, user.role);
          res.json({
            message: "Login successful",
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: token,
            profilePictureUrl: user.profilePictureUrl || null
          });
          _context2.next = 30;
          break;

        case 26:
          _context2.prev = 26;
          _context2.t0 = _context2["catch"](0);
          console.error("Login error:", _context2.t0);
          res.status(_context2.t0.message.includes("required") ? 400 : 500).json({
            error: _context2.t0.message || "Login failed due to server error."
          });

        case 30:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 26]]);
}; // @desc    Google OAuth Login/Registration
// @route   POST /api/auth/google
// @access  Public


var googleLogin = function googleLogin(req, res) {
  var _req$body3, idToken, role, ticket, payload, googleId, email, name, picture, user, sessionToken;

  return regeneratorRuntime.async(function googleLogin$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body3 = req.body, idToken = _req$body3.idToken, role = _req$body3.role;

          if (idToken) {
            _context3.next = 3;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            error: "Missing ID token"
          }));

        case 3:
          if (role) {
            _context3.next = 5;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            error: "Missing role"
          }));

        case 5:
          _context3.prev = 5;
          _context3.next = 8;
          return regeneratorRuntime.awrap(client.verifyIdToken({
            idToken: idToken,
            audience: GOOGLE_CLIENT_ID
          }));

        case 8:
          ticket = _context3.sent;
          payload = ticket.getPayload();
          googleId = payload.sub, email = payload.email, name = payload.name, picture = payload.picture;
          _context3.next = 13;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 13:
          user = _context3.sent;

          if (user) {
            _context3.next = 20;
            break;
          }

          user = new User({
            googleId: googleId,
            email: email,
            name: name || "",
            username: email.split("@")[0].replace(/[^a-z0-9-]/g, ""),
            profilePictureUrl: picture || "",
            isProfileComplete: false,
            role: role
          });
          _context3.next = 18;
          return regeneratorRuntime.awrap(user.save());

        case 18:
          _context3.next = 25;
          break;

        case 20:
          if (user.googleId) {
            _context3.next = 25;
            break;
          }

          user.googleId = googleId;
          user.profilePictureUrl = picture || user.profilePictureUrl;
          _context3.next = 25;
          return regeneratorRuntime.awrap(user.save());

        case 25:
          if (!(user.role !== role)) {
            _context3.next = 27;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            error: "User with email ".concat(email, " is already registered as a ").concat(user.role, ".")
          }));

        case 27:
          sessionToken = generateToken(user._id, user.role);
          res.status(200).json({
            message: "Google login successful",
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: sessionToken,
            profilePictureUrl: user.profilePictureUrl || null,
            isProfileComplete: user.isProfileComplete
          });
          _context3.next = 35;
          break;

        case 31:
          _context3.prev = 31;
          _context3.t0 = _context3["catch"](5);
          console.error("Google OAuth verification failed:", _context3.t0);
          res.status(401).json({
            error: "Authentication failed"
          });

        case 35:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[5, 31]]);
}; // @desc    Send OTP for password reset
// @route   POST /api/auth/send-otp
// @access  Public


var sendOtp = function sendOtp(req, res) {
  var user, timeSinceLastOtp, otp, expiresAt;
  return regeneratorRuntime.async(function sendOtp$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          validateInput(req.body, ["email"]);
          _context4.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            email: req.body.email
          }));

        case 4:
          user = _context4.sent;

          if (user) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", res.status(200).json({
            message: "If an account with that email exists, an OTP has been sent."
          }));

        case 7:
          if (!(user.otp && user.otp.expiresAt && user.otp.expiresAt.getTime() > Date.now())) {
            _context4.next = 11;
            break;
          }

          timeSinceLastOtp = (user.otp.expiresAt.getTime() - Date.now()) / 1000;

          if (!(timeSinceLastOtp > 240)) {
            _context4.next = 11;
            break;
          }

          return _context4.abrupt("return", res.status(429).json({
            error: "Please wait ".concat(Math.ceil(timeSinceLastOtp - 240), " seconds before requesting another OTP.")
          }));

        case 11:
          otp = Math.floor(100000 + Math.random() * 900000).toString();
          expiresAt = Date.now() + 300000;
          user.otp = {
            code: otp,
            expiresAt: new Date(expiresAt)
          };
          _context4.next = 16;
          return regeneratorRuntime.awrap(user.save());

        case 16:
          _context4.next = 18;
          return regeneratorRuntime.awrap(sendEmail(req.body.email, "Your Connecting Constructions Password Reset OTP", "Your OTP code for password reset is: ".concat(otp, ". This code is valid for 5 minutes.")));

        case 18:
          res.json({
            message: "OTP sent successfully! Please check your email."
          });
          _context4.next = 25;
          break;

        case 21:
          _context4.prev = 21;
          _context4.t0 = _context4["catch"](0);
          console.error("Send OTP error:", _context4.t0);
          res.status(500).json({
            error: "Failed to send OTP. Please try again later."
          });

        case 25:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 21]]);
}; // @desc    Reset Password with OTP
// @route   POST /api/auth/reset-password
// @access  Public


var resetPassword = function resetPassword(req, res) {
  var _req$body4, email, otp, newPassword, user;

  return regeneratorRuntime.async(function resetPassword$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          validateInput(req.body, ["email", "otp", "newPassword"]);
          _req$body4 = req.body, email = _req$body4.email, otp = _req$body4.otp, newPassword = _req$body4.newPassword;
          _context5.next = 5;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 5:
          user = _context5.sent;

          if (user) {
            _context5.next = 8;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            error: "Invalid request (user not found for email)."
          }));

        case 8:
          if (!(!user.otp || user.otp.code !== otp)) {
            _context5.next = 10;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            error: "Invalid or incorrect OTP code."
          }));

        case 10:
          if (!(user.otp.expiresAt < new Date())) {
            _context5.next = 15;
            break;
          }

          user.otp = undefined;
          _context5.next = 14;
          return regeneratorRuntime.awrap(user.save());

        case 14:
          return _context5.abrupt("return", res.status(400).json({
            error: "OTP expired. Please request a new one."
          }));

        case 15:
          user.password = newPassword;
          user.otp = undefined;
          _context5.next = 19;
          return regeneratorRuntime.awrap(user.save());

        case 19:
          res.json({
            message: "Password reset successful!"
          });
          _context5.next = 26;
          break;

        case 22:
          _context5.prev = 22;
          _context5.t0 = _context5["catch"](0);
          console.error("Reset Password error:", _context5.t0);
          res.status(500).json({
            error: "Failed to reset password. Please try again later."
          });

        case 26:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 22]]);
}; // @desc    Get current authenticated user's profile
// @route   GET /api/auth/profile
// @access  Private (requires 'protect' middleware)


var getUserProfile = function getUserProfile(req, res) {
  var user;
  return regeneratorRuntime.async(function getUserProfile$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          if (!req.user) {
            _context6.next = 6;
            break;
          }

          _context6.next = 3;
          return regeneratorRuntime.awrap(User.findById(req.user.id).select("-password"));

        case 3:
          user = _context6.sent;

          if (!user) {
            _context6.next = 6;
            break;
          }

          return _context6.abrupt("return", res.json({
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role,
            phoneNumber: user.phoneNumber,
            address: user.address,
            createdAt: user.createdAt
          }));

        case 6:
          res.status(404).json({
            message: "User not found."
          });

        case 7:
        case "end":
          return _context6.stop();
      }
    }
  });
}; // @desc    Update current authenticated user's profile
// @route   PUT /api/auth/profile
// @access  Private (requires 'protect' middleware)


var updateUserProfile = function updateUserProfile(req, res) {
  var user, isMatch, updatedUser, token;
  return regeneratorRuntime.async(function updateUserProfile$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return regeneratorRuntime.awrap(User.findById(req.user.id));

        case 2:
          user = _context7.sent;

          if (!user) {
            _context7.next = 27;
            break;
          }

          user.name = req.body.name || user.name;
          user.username = req.body.username || user.username;
          user.email = req.body.email || user.email;
          user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
          user.address = req.body.address || user.address;

          if (!(req.body.currentPassword && req.body.newPassword)) {
            _context7.next = 18;
            break;
          }

          _context7.next = 12;
          return regeneratorRuntime.awrap(user.matchPassword(req.body.currentPassword));

        case 12:
          isMatch = _context7.sent;

          if (isMatch) {
            _context7.next = 15;
            break;
          }

          return _context7.abrupt("return", res.status(400).json({
            message: "Current password is incorrect."
          }));

        case 15:
          user.password = req.body.newPassword;
          _context7.next = 20;
          break;

        case 18:
          if (!req.body.newPassword) {
            _context7.next = 20;
            break;
          }

          return _context7.abrupt("return", res.status(400).json({
            message: "Current password is required to change password."
          }));

        case 20:
          _context7.next = 22;
          return regeneratorRuntime.awrap(user.save());

        case 22:
          updatedUser = _context7.sent;
          token = generateToken(updatedUser._id, updatedUser.role);
          res.json({
            message: "Profile updated successfully!",
            _id: updatedUser._id,
            name: updatedUser.name,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
            phoneNumber: updatedUser.phoneNumber,
            address: updatedUser.address,
            token: token
          });
          _context7.next = 28;
          break;

        case 27:
          res.status(404).json({
            message: "User not found."
          });

        case 28:
        case "end":
          return _context7.stop();
      }
    }
  });
}; // @desc    Complete user profile after initial Google signup
// @route   POST /api/auth/complete-profile
// @access  Private (requires JWT auth)


var completeUserProfile = function completeUserProfile(req, res) {
  var userId, _req$body5, role, phoneNumber, hostelName, hostelLocation, user, updatedUser;

  return regeneratorRuntime.async(function completeUserProfile$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          userId = req.user.userId;
          _req$body5 = req.body, role = _req$body5.role, phoneNumber = _req$body5.phoneNumber, hostelName = _req$body5.hostelName, hostelLocation = _req$body5.hostelLocation;
          _context8.prev = 2;
          _context8.next = 5;
          return regeneratorRuntime.awrap(User.findById(userId));

        case 5:
          user = _context8.sent;

          if (user) {
            _context8.next = 8;
            break;
          }

          return _context8.abrupt("return", res.status(404).json({
            error: "User not found."
          }));

        case 8:
          user.role = role;
          user.phoneNumber = phoneNumber;
          user.isProfileComplete = true;

          if (role === "hostel owner") {
            user.hostelName = hostelName;
            user.hostelLocation = hostelLocation;
          }

          _context8.next = 14;
          return regeneratorRuntime.awrap(user.save());

        case 14:
          updatedUser = _context8.sent;
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
              hostelLocation: updatedUser.hostelLocation
            }
          });
          _context8.next = 22;
          break;

        case 18:
          _context8.prev = 18;
          _context8.t0 = _context8["catch"](2);
          console.error("Error completing user profile:", _context8.t0);
          res.status(500).json({
            error: "Failed to update profile."
          });

        case 22:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[2, 18]]);
};

module.exports = {
  registerUser: registerUser,
  loginUser: loginUser,
  googleLogin: googleLogin,
  sendOtp: sendOtp,
  resetPassword: resetPassword,
  getUserProfile: getUserProfile,
  updateUserProfile: updateUserProfile,
  completeUserProfile: completeUserProfile
};