// server/models/Cart.js
const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  // Store product snapshot (in case product changes/deleted)
  productSnapshot: {
    name: String,
    price: Number,
    unit: String,
    imageUrl: String,
    category: String,
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
});

const cartSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One cart per customer
    },
    items: [cartItemSchema],
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// ===== VIRTUALS =====

// Calculate total items
cartSchema.virtual("totalItems").get(function () {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Calculate total price
cartSchema.virtual("totalPrice").get(function () {
  return this.items.reduce(
    (total, item) => total + (item.productSnapshot.price || 0) * item.quantity,
    0,
  );
});

// ===== METHODS =====

// Add item to cart
cartSchema.methods.addItem = async function (productId, quantity = 1) {
  const Product = mongoose.model("Product");
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  if (!product.inStock) {
    throw new Error("Product out of stock");
  }

  // Check if item already exists
  const existingItemIndex = this.items.findIndex(
    (item) => item.product.toString() === productId.toString(),
  );

  if (existingItemIndex > -1) {
    // Update quantity
    this.items[existingItemIndex].quantity += quantity;
  } else {
    // Add new item with snapshot
    this.items.push({
      product: productId,
      quantity,
      productSnapshot: {
        name: product.name,
        price: product.price,
        unit: product.unit || "units",
        imageUrl: product.imageUrls?.[0] || "",
        category: product.category,
        supplier: product.supplier,
      },
    });
  }

  this.updatedAt = Date.now();
  return this.save();
};

// Update item quantity
cartSchema.methods.updateItemQuantity = function (productId, quantity) {
  const itemIndex = this.items.findIndex(
    (item) => item.product.toString() === productId.toString(),
  );

  if (itemIndex === -1) {
    throw new Error("Item not found in cart");
  }

  if (quantity <= 0) {
    this.items.splice(itemIndex, 1);
  } else {
    this.items[itemIndex].quantity = quantity;
  }

  this.updatedAt = Date.now();
  return this.save();
};

// Remove item from cart
cartSchema.methods.removeItem = function (productId) {
  this.items = this.items.filter(
    (item) => item.product.toString() !== productId.toString(),
  );
  this.updatedAt = Date.now();
  return this.save();
};

// Clear cart
cartSchema.methods.clearCart = function () {
  this.items = [];
  this.updatedAt = Date.now();
  return this.save();
};

// ===== INDEXES =====
cartSchema.index({ customer: 1 });
cartSchema.index({ updatedAt: -1 });

// Enable virtuals in JSON
cartSchema.set("toJSON", { virtuals: true });
cartSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Cart", cartSchema);
