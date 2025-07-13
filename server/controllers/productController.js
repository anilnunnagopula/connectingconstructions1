// server/controllers/productController.js
const Product = require("../models/Product");
const User = require("../models/User");

// --- New: Get Product by ID ---
const getProductById = async (req, res) => {
  try {
    const productId = req.params.id; // Get product ID from URL parameters

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required." });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    // Optional: Add authorization check here to ensure only the owner can view/edit
    // For example, if you have user authentication middleware:
    // if (product.supplierId.toString() !== req.user.id) {
    //     return res.status(403).json({ error: 'Unauthorized access to product.' });
    // }

    res.status(200).json({ message: "Product fetched successfully!", product });
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch product", details: error.message });
  }
};

// --- New: Update Product ---
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id; // Get product ID from URL parameters
    const {
      supplierId: supplierEmail,
      name,
      category,
      price,
      quantity,
      availability,
      location,
      contact,
      imageUrl,
    } = req.body;

    if (!productId) {
      return res
        .status(400)
        .json({ error: "Product ID is required for update." });
    }

    // Basic validation for incoming data
    if (
      !supplierEmail ||
      !name ||
      !category ||
      !price ||
      !quantity ||
      !location ||
      !location.text ||
      !contact ||
      !contact.mobile ||
      !contact.email ||
      !contact.address
    ) {
      return res
        .status(400)
        .json({ error: "All product and contact fields are required." });
    }

    // Find the actual User _id based on the email sent from the frontend
    const supplierUser = await User.findOne({ email: supplierEmail });

    if (!supplierUser) {
      return res
        .status(404)
        .json({ error: "Supplier user not found in database." });
    }
    if (supplierUser.role !== "supplier") {
      return res
        .status(403)
        .json({ error: "Unauthorized: User is not a supplier." });
    }

    // Find the product and update it
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    // Optional: Authorization check - ensure the logged-in supplier owns this product
    // if (product.supplierId.toString() !== supplierUser._id.toString()) {
    //     return res.status(403).json({ error: 'Unauthorized: You do not own this product.' });
    // }

    product.name = name;
    product.category = category;
    product.price = parseFloat(price);
    product.quantity = parseInt(quantity, 10);
    product.availability = availability;
    product.location = location;
    product.contact = contact;
    product.imageUrl = imageUrl; // Update image URL/base64

    await product.save(); // Save the updated product

    res.status(200).json({ message: "Product updated successfully!", product });
  } catch (error) {
    console.error("Error updating product:", error);
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res
        .status(400)
        .json({ error: "Validation failed", details: errors });
    }
    res
      .status(500)
      .json({ error: "Failed to update product", details: error.message });
  }
};

// --- Existing: Add Product ---
const addProduct = async (req, res) => {
  try {
    console.log("Received product data:", req.body);

    const {
      supplierId: supplierEmail,
      name,
      category,
      price,
      quantity,
      availability,
      location,
      contact,
      imageUrl,
      description,
    } = req.body; // Added description here

    if (
      !supplierEmail ||
      !name ||
      !category ||
      !price ||
      !quantity ||
      !location ||
      !location.text ||
      !contact ||
      !contact.mobile ||
      !contact.email ||
      !contact.address ||
      !description
    ) {
      // Added description to validation
      return res
        .status(400)
        .json({ error: "All product and contact fields are required." });
    }

    const supplierUser = await User.findOne({ email: supplierEmail });

    if (!supplierUser) {
      return res
        .status(404)
        .json({ error: "Supplier user not found in database." });
    }
    if (supplierUser.role !== "supplier") {
      return res
        .status(403)
        .json({ error: "Unauthorized: User is not a supplier." });
    }

    const newProduct = new Product({
      supplierId: supplierUser._id,
      name,
      category,
      price,
      quantity,
      availability,
      location,
      contact,
      imageUrl,
      description, // Save description
    });

    await newProduct.save();

    res
      .status(201)
      .json({ message: "Product added successfully!", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res
        .status(400)
        .json({ error: "Validation failed", details: errors });
    }
    res
      .status(500)
      .json({ error: "Failed to add product", details: error.message });
  }
};

module.exports = { addProduct, getProductById, updateProduct }; // Export new functions
