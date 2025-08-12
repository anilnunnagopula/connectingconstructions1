"use strict";

var mongoose = require("mongoose");

var bcrypt = require("bcryptjs");

var userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    "enum": ["customer", "supplier", "admin"],
    "default": "customer"
  },
  isProfileComplete: {
    type: Boolean,
    "default": false
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/.+@.+\..+/, "Please enter a valid email address"]
  },
  password: {
    type: String,
    // CHANGE: password is no longer required for OAuth users
    required: false,
    // Changed from true to false
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  otp: {
    code: String,
    expiresAt: Date
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  location: {
    lat: {
      type: Number,
      "default": null
    },
    lng: {
      type: Number,
      "default": null
    }
  },
  profilePictureUrl: {
    type: String,
    "default": ""
  },
  cart: [{
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  wishlist: [{
    type: mongoose.Schema.ObjectId,
    ref: "Product"
  }],
  notifications: [{
    message: {
      type: String,
      required: true
    },
    read: {
      type: Boolean,
      "default": false
    },
    createdAt: {
      type: Date,
      "default": Date.now
    },
    link: String
  }]
}, {
  timestamps: true
}); // Mongoose pre-save hook to hash password before saving

userSchema.pre("save", function _callee(next) {
  var salt;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!(this.isModified("password") && this.password)) {
            _context.next = 14;
            break;
          }

          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(bcrypt.genSalt(10));

        case 4:
          salt = _context.sent;
          _context.next = 7;
          return regeneratorRuntime.awrap(bcrypt.hash(this.password, salt));

        case 7:
          this.password = _context.sent;
          return _context.abrupt("return", next());

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](1);
          return _context.abrupt("return", next(_context.t0));

        case 14:
          next();

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, this, [[1, 11]]);
}); // Method to compare entered password with hashed password

userSchema.methods.matchPassword = function _callee2(enteredPassword) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (this.password) {
            _context2.next = 2;
            break;
          }

          return _context2.abrupt("return", false);

        case 2:
          _context2.next = 4;
          return regeneratorRuntime.awrap(bcrypt.compare(enteredPassword, this.password));

        case 4:
          return _context2.abrupt("return", _context2.sent);

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  }, null, this);
};

module.exports = mongoose.model("User", userSchema);