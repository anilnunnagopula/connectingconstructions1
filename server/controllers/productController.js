// server/controllers/productController.js
const Product = require("../models/Product");
const User = require("../models/User"); // Import your User model to find supplier's _id

const addProduct = async (req, res) => {
  try {
    console.log("Received product data:", req.body); // Log incoming data for debugging

    // Destructure all expected fields from the request body
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

    // Basic server-side validation
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

    // Create a new Product instance
    const newProduct = new Product({
      supplierId: supplierUser._id, // Store the actual MongoDB _id of the supplier
      name,
      category,
      price,
      quantity,
      availability,
      location,
      contact,
      imageUrl,
    });

    // Save the new product to the database
    await newProduct.save();

    // Respond with success message and the created product
    res
      .status(201)
      .json({ message: "Product added successfully!", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    // Handle Mongoose validation errors specifically
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

module.exports = { addProduct };
