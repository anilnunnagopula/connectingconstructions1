"use strict";

// server/models/User.js
var mongoose = require("mongoose");

var bcrypt = require("bcryptjs");

var userSchema = new mongoose.Schema({
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
    // Added 'admin' role if you use it
    "default": "customer"
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
    required: true,
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
    // Nested object for geographic location (lat/lng)
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
    // NEW: URL for user's profile image
    type: String,
    "default": "" // Default to empty string if no image

  },
  // --- Customer-specific fields ---
  cart: [// Array of items in the customer's cart
  {
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    } // Could also store name, price, image directly for faster cart loading

  }],
  wishlist: [// Array of product IDs in the customer's wishlist
  {
    type: mongoose.Schema.ObjectId,
    ref: "Product"
  }],
  notifications: [// Array of notifications for the user
  {
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
    link: String // Optional link for the notification

  }]
}, {
  timestamps: true // Automatically adds createdAt and updatedAt

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
          next(_context.t0);

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, this, [[2, 12]]);
}); // Method to compare entered password with hashed password

userSchema.methods.matchPassword = function _callee2(enteredPassword) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(bcrypt.compare(enteredPassword, this.password));

        case 2:
          return _context2.abrupt("return", _context2.sent);

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  }, null, this);
};

module.exports = mongoose.model("User", userSchema);