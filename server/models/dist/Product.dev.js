"use strict";

// server/models/Product.js
var mongoose = require("mongoose");

var productSchema = new mongoose.Schema({
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  // ===== PRODUCT TYPE SYSTEM =====
  productType: {
    type: String,
    "enum": ["material", "service", "product"],
    "default": "product",
    required: true
  },
  // For materials (bulk items)
  unit: {
    type: String,
    "enum": ["bags", "kg", "tonnes", "liters", "cubic_ft", "sq_ft", "pieces", "units"],
    required: function required() {
      return this.productType === "material";
    }
  },
  minOrderQuantity: {
    type: Number,
    "default": 1,
    min: 1
  },
  stepSize: {
    type: Number,
    "default": 1,
    min: 1
  },
  // For services (quote-based)
  isQuoteOnly: {
    type: Boolean,
    "default": false
  },
  basePrice: {
    type: Number,
    // For services: starting price
    min: 0
  },
  // ===== EXISTING FIELDS =====
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: function required() {
      return this.productType !== "service"; // Services don't have quantity
    },
    min: 0
  },
  availability: {
    type: Boolean,
    "default": true
  },
  location: {
    text: {
      type: String,
      required: true
    },
    lat: {
      type: Number
    },
    lng: {
      type: Number
    }
  },
  contact: {
    mobile: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    }
  },
  imageUrls: {
    type: [String],
    required: false,
    "default": []
  },
  averageRating: {
    type: Number,
    "default": 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    "default": 0
  },
  isDeleted: {
    type: Boolean,
    "default": false
  },
  deletedAt: {
    type: Date
  }
}, {
  timestamps: true
}); // ===== INDEXES =====

productSchema.index({
  name: 1,
  supplier: 1
}, {
  unique: true
});
productSchema.index({
  category: 1,
  isDeleted: 1,
  availability: 1
});
productSchema.index({
  productType: 1,
  category: 1
});
productSchema.index({
  supplier: 1,
  isDeleted: 1
});
productSchema.index({
  name: "text",
  description: "text"
});
productSchema.index({
  price: 1
});
productSchema.index({
  averageRating: -1
});
productSchema.index({
  category: 1,
  price: 1,
  isDeleted: 1
});
productSchema.index({
  createdAt: -1,
  isDeleted: 1
}); // ===== VIRTUALS =====

productSchema.virtual("inStock").get(function () {
  if (this.productType === "service") return this.availability;
  return this.quantity > 0 && this.availability && !this.isDeleted;
});
productSchema.virtual("pricePerUnit").get(function () {
  if (this.productType === "material" && this.unit) {
    return "\u20B9".concat(this.price, "/").concat(this.unit);
  }

  return "\u20B9".concat(this.price);
}); // ===== METHODS =====

productSchema.methods.softDelete = function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.availability = false;
  return this.save();
};

productSchema.methods.restore = function () {
  this.isDeleted = false;
  this.deletedAt = null;
  return this.save();
};

productSchema.methods.decreaseStock = function (quantity) {
  if (this.productType === "service") {
    throw new Error("Services don't have stock");
  }

  if (this.quantity >= quantity) {
    this.quantity -= quantity;

    if (this.quantity === 0) {
      this.availability = false;
    }

    return this.save();
  }

  throw new Error("Insufficient stock");
};

productSchema.methods.increaseStock = function (quantity) {
  if (this.productType === "service") {
    throw new Error("Services don't have stock");
  }

  this.quantity += quantity;

  if (this.quantity > 0) {
    this.availability = true;
  }

  return this.save();
};

productSchema.methods.updateRating = function (newAverage, newCount) {
  this.averageRating = newAverage;
  this.numReviews = newCount;
  return this.save();
}; // ===== MIDDLEWARE =====


productSchema.pre("save", function (next) {
  // Set isQuoteOnly based on productType
  if (this.productType === "service") {
    this.isQuoteOnly = true;
    this.quantity = 0; // Services don't have quantity
  } // Auto-update availability based on quantity for materials/products


  if (this.isModified("quantity") && this.productType !== "service") {
    if (this.quantity === 0) {
      this.availability = false;
    }
  }

  next();
}); // ===== QUERY HELPERS =====

productSchema.query.notDeleted = function () {
  return this.where({
    isDeleted: false
  });
};

productSchema.query.available = function () {
  return this.where({
    isDeleted: false,
    availability: true
  });
};

productSchema.query.materials = function () {
  return this.where({
    productType: "material",
    isDeleted: false
  });
};

productSchema.query.services = function () {
  return this.where({
    productType: "service",
    isDeleted: false
  });
}; // In server/models/Product.js, add these methods before module.exports


productSchema.methods.decreaseStock = function (quantity) {
  if (this.quantity >= quantity) {
    this.quantity -= quantity;
    return this.save();
  } else {
    throw new Error("Insufficient stock. Available: ".concat(this.quantity));
  }
};

productSchema.methods.increaseStock = function (quantity) {
  this.quantity += quantity;
  return this.save();
};

module.exports = mongoose.model("Product", productSchema);