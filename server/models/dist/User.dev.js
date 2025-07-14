"use strict";

// models/User.js (Example - you should have something similar)
var mongoose = require("mongoose");

var bcrypt = require("bcryptjs"); // Important for the pre-save hook


var userSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  otp: {
    code: String,
    expiresAt: Date
  } // ... other fields

}); // Mongoose pre-save hook to hash password before saving

userSchema.pre("save", function _callee(next) {
  var salt;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (this.isModified("password")) {
            _context.next = 2;
            break;
          }

          return _context.abrupt("return", next());

        case 2:
          _context.prev = 2;
          _context.next = 5;
          return regeneratorRuntime.awrap(bcrypt.genSalt(10));

        case 5:
          salt = _context.sent;
          _context.next = 8;
          return regeneratorRuntime.awrap(bcrypt.hash(this.password, salt));

        case 8:
          this.password = _context.sent;
          next();
          _context.next = 15;
          break;

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](2);
          next(_context.t0); // Pass error to the next middleware

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, this, [[2, 12]]);
});
module.exports = mongoose.model("User", userSchema);