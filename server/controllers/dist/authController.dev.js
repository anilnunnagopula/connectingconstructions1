"use strict";

var User = require("../models/User");

var sendEmail = require("../utils/sendEmail");

var bcrypt = require("bcryptjs"); // Import bcryptjs
// Helper function for validation


var validateInput = function validateInput(data, fields) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = fields[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var field = _step.value;

      if (!data[field]) {
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
}; // Register User


var registerUser = function registerUser(req, res) {
  var _req$body, role, email, password, name, existingUser, newUser;

  return regeneratorRuntime.async(function registerUser$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          console.log("Incoming registration request:", req.body);
          _req$body = req.body, role = _req$body.role, email = _req$body.email, password = _req$body.password, name = _req$body.name;

          if (!(!role || !email || !password || !name)) {
            _context.next = 5;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: "All fields required"
          }));

        case 5:
          console.log("Checking for existing user...");
          _context.next = 8;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }).maxTimeMS(10000).exec());

        case 8:
          existingUser = _context.sent;

          if (!existingUser) {
            _context.next = 11;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: "Email already exists"
          }));

        case 11:
          console.log("Creating new user..."); // The User model's pre-save hook will hash the password

          newUser = new User({
            role: role,
            email: email,
            password: password,
            name: name
          });
          _context.next = 15;
          return regeneratorRuntime.awrap(newUser.save());

        case 15:
          // This triggers the pre-save hook to hash 'password'
          res.status(201).json({
            message: "Registration successful"
          });
          _context.next = 22;
          break;

        case 18:
          _context.prev = 18;
          _context.t0 = _context["catch"](0);
          console.error("Registration error:", _context.t0);
          res.status(500).json({
            error: "Registration failed",
            details: _context.t0.message
          });

        case 22:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 18]]);
}; // Login User


var loginUser = function loginUser(req, res) {
  var _req$body2, email, password, role, user, isMatch;

  return regeneratorRuntime.async(function loginUser$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          console.log("Incoming login request:", req.body);
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password, role = _req$body2.role;

          if (!(!email || !password || !role)) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            error: "Email, password, and role are required"
          }));

        case 5:
          console.log("Attempting to find user with email: '".concat(email, "' and role: '").concat(role, "'"));
          _context2.next = 8;
          return regeneratorRuntime.awrap(User.findOne({
            email: email,
            role: role
          }));

        case 8:
          user = _context2.sent;

          if (user) {
            _context2.next = 12;
            break;
          }

          console.log("Login attempt: User not found for provided email/role combination.");
          return _context2.abrupt("return", res.status(401).json({
            error: "Invalid credentials"
          }));

        case 12:
          // IMPORTANT CHANGE: Use bcrypt.compare() to compare the provided password with the hashed password
          console.log("Login attempt: User found. Comparing passwords...");
          _context2.next = 15;
          return regeneratorRuntime.awrap(bcrypt.compare(password, user.password));

        case 15:
          isMatch = _context2.sent;

          if (isMatch) {
            _context2.next = 19;
            break;
          }

          console.log("Login attempt: Password mismatch.");
          return _context2.abrupt("return", res.status(401).json({
            error: "Invalid credentials"
          }));

        case 19:
          console.log("Login successful for user: ".concat(user.email, " (").concat(user.role, ")"));
          res.json({
            message: "Login successful",
            role: user.role,
            name: user.name // You might want to send a JWT token here for actual authentication
            // token: generateAuthToken(user)

          });
          _context2.next = 27;
          break;

        case 23:
          _context2.prev = 23;
          _context2.t0 = _context2["catch"](0);
          console.error("Login error:", _context2.t0); // Be careful with exposing err.message directly in production for security reasons

          res.status(500).json({
            error: "Login failed: " + _context2.t0.message
          });

        case 27:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 23]]);
}; // Send OTP


var sendOtp = function sendOtp(req, res) {
  var user, otp, expiresAt;
  return regeneratorRuntime.async(function sendOtp$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          validateInput(req.body, ["email"]);
          _context3.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            email: req.body.email
          }));

        case 4:
          user = _context3.sent;

          if (user) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            error: "User not found"
          }));

        case 7:
          if (!(user.otp && user.otp.expiresAt && user.otp.expiresAt.getTime() > Date.now())) {
            _context3.next = 10;
            break;
          }

          if (!(user.otp.expiresAt.getTime() - Date.now() < 4 * 60 * 1000)) {
            _context3.next = 10;
            break;
          }

          return _context3.abrupt("return", res.status(429).json({
            error: "Please wait before requesting another OTP."
          }));

        case 10:
          otp = Math.floor(100000 + Math.random() * 900000).toString();
          expiresAt = Date.now() + 300000; // 5 minutes (in milliseconds)

          user.otp = {
            code: otp,
            expiresAt: new Date(expiresAt)
          };
          _context3.next = 15;
          return regeneratorRuntime.awrap(user.save());

        case 15:
          _context3.next = 17;
          return regeneratorRuntime.awrap(sendEmail(req.body.email, "Your Password Reset OTP", "Your OTP code is: ".concat(otp)));

        case 17:
          res.json({
            message: "OTP sent successfully! Please check your email."
          });
          _context3.next = 24;
          break;

        case 20:
          _context3.prev = 20;
          _context3.t0 = _context3["catch"](0);
          console.error("Send OTP error:", _context3.t0); // Log the actual error

          res.status(500).json({
            error: _context3.t0.message || "Failed to send OTP."
          }); // Provide a generic message for security

        case 24:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 20]]);
}; // Reset Password


var resetPassword = function resetPassword(req, res) {
  var _req$body3, email, otp, newPassword, user, salt;

  return regeneratorRuntime.async(function resetPassword$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          validateInput(req.body, ["email", "otp", "newPassword"]);
          _req$body3 = req.body, email = _req$body3.email, otp = _req$body3.otp, newPassword = _req$body3.newPassword;
          _context4.next = 5;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 5:
          user = _context4.sent;

          if (user) {
            _context4.next = 8;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            error: "User not found."
          }));

        case 8:
          if (!(!user.otp || !user.otp.code || !user.otp.expiresAt)) {
            _context4.next = 10;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            error: "No OTP found for this user or invalid request."
          }));

        case 10:
          if (!(user.otp.code !== otp)) {
            _context4.next = 12;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            error: "Invalid OTP code."
          }));

        case 12:
          if (!(user.otp.expiresAt < new Date())) {
            _context4.next = 17;
            break;
          }

          // Clear expired OTP to prevent reuse
          user.otp = undefined;
          _context4.next = 16;
          return regeneratorRuntime.awrap(user.save());

        case 16:
          return _context4.abrupt("return", res.status(400).json({
            error: "OTP expired. Please request a new one."
          }));

        case 17:
          _context4.next = 19;
          return regeneratorRuntime.awrap(bcrypt.genSalt(10));

        case 19:
          salt = _context4.sent;
          _context4.next = 22;
          return regeneratorRuntime.awrap(bcrypt.hash(newPassword, salt));

        case 22:
          user.password = _context4.sent;
          user.otp = undefined; // Clear OTP after successful reset

          _context4.next = 26;
          return regeneratorRuntime.awrap(user.save());

        case 26:
          res.json({
            message: "Password reset successful!"
          });
          _context4.next = 33;
          break;

        case 29:
          _context4.prev = 29;
          _context4.t0 = _context4["catch"](0);
          console.error("Reset Password error:", _context4.t0);
          res.status(500).json({
            error: _context4.t0.message || "Failed to reset password."
          });

        case 33:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 29]]);
};

module.exports = {
  registerUser: registerUser,
  loginUser: loginUser,
  sendOtp: sendOtp,
  // Removed verifyOtp as it's typically combined into resetPassword for a single flow
  resetPassword: resetPassword
};