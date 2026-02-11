// server/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["customer", "supplier", "admin"],
      default: "customer",
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: false,
      minlength: 6,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    name: {
      type: String,
      required: true,
      trim: true,
    },
    otp: {
      code: String,
      expiresAt: Date,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    location: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },
    profilePictureUrl: {
      type: String,
      default: "",
    },
    cart: [
      {
        productId: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    wishlist: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    ],
    notifications: [
      {
        message: { type: String, required: true },
        read: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
        link: String,
      },
    ],
    // ✨ NEW: Customer delivery addresses
    addresses: [
      {
        label: {
          type: String,
          required: true,
          trim: true,
        },
        fullName: {
          type: String,
          required: true,
          trim: true,
        },
        phone: {
          type: String,
          required: true,
          trim: true,
        },
        addressLine1: {
          type: String,
          required: true,
          trim: true,
        },
        addressLine2: {
          type: String,
          trim: true,
        },
        city: {
          type: String,
          required: true,
          trim: true,
        },
        state: {
          type: String,
          required: true,
          trim: true,
        },
        pincode: {
          type: String,
          required: true,
          trim: true,
        },
        landmark: {
          type: String,
          trim: true,
        },
        isDefault: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // ✨ NEW: Soft delete
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },

    // ✨ NEW: Admin & Supplier Verification
    isActive: {
      type: Boolean,
      default: true, // Used for suspending accounts
    },
    isVerified: {
      type: Boolean,
      default: false, // Only for suppliers
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected", "none"],
      default: "none",
    },
    supplierTier: {
        type: String,
        enum: ["standard", "silver", "gold", "platinum"],
        default: "standard"
    },
    verifiedAt: {
      type: Date,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Admin who verified
    },
  },
  {
    timestamps: true,
  },
);

// ===== INDEXES (CRITICAL FOR PERFORMANCE) =====

// Already indexed automatically: _id, email, username (unique fields)

// Index for authentication queries
userSchema.index({ email: 1, role: 1 });

// Index for Google OAuth
userSchema.index({ googleId: 1 });

// Index for password reset
userSchema.index({ resetPasswordToken: 1 });

// Index for soft delete queries
userSchema.index({ isDeleted: 1 });

// Index for finding suppliers
userSchema.index({ role: 1, isDeleted: 1 });
userSchema.index({ isVerified: 1 });
userSchema.index({ verificationStatus: 1 });

// ===== MONGOOSE MIDDLEWARE =====

// Pre-save: Hash password
userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      return next();
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// ===== METHODS =====

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate password reset token
userSchema.methods.getResetPasswordToken = function () {
  const crypto = require("crypto");
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

// Soft delete method
userSchema.methods.softDelete = function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
