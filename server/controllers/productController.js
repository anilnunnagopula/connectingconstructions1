// server/controllers/productController.js
const Product = require("../models/Product");
const User = require("../models/User"); 
const json2csv = require('json2csv').parse; // Import json2csv library
// --- Helper for input validation (can be shared or put in utils) ---
const validateProductInput = (data) => {
  const { name, category, price, quantity, location, contact, description } =
    data;
  if (
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
    throw new Error("All product and contact fields are required.");
  }
  if (isNaN(price) || parseFloat(price) < 0) {
    throw new Error("Price must be a non-negative number.");
  }
  if (isNaN(quantity) || parseInt(quantity, 10) < 0) {
    throw new Error("Quantity must be a non-negative integer.");
  }
};

// @desc    Add a new product
// @route   POST /api/supplier/products
// @access  Private (Supplier only)
const addProduct = async (req, res) => {
  try {
    // req.user is populated by the 'protect' middleware and 'authorizeRoles("supplier")'
    // ensures only suppliers can reach this point.
    const supplierId = req.user.id; // Get supplier's _id directly from authenticated user
    const supplierEmail = req.user.email; // Get supplier's email (useful for contact info)
    const supplierName = req.user.name; // Get supplier's name (useful for context)

    console.log("Adding product for supplier:", supplierId, supplierEmail);

    const {
      name,
      category,
      price,
      quantity,
      availability,
      location, // expects { text, lat, lng }
      contact, // expects { mobile, email, address }
      imageUrls, // Use imageUrls array
      description,
    } = req.body;

    // Use the new validation helper
    validateProductInput(req.body);

    // Check for duplicate product name for this specific supplier
    const existingProduct = await Product.findOne({
      name,
      supplier: supplierId,
    });
    if (existingProduct) {
      return res
        .status(400)
        .json({ error: "You already have a product with this name." });
    }

    const newProduct = new Product({
      supplier: supplierId, // Use the authenticated supplier's _id
      name,
      category,
      price: parseFloat(price),
      quantity: parseInt(quantity, 10),
      availability: availability !== undefined ? availability : true, // Default to true if not provided
      location,
      contact,
      imageUrls: imageUrls || [], // Ensure it's an array
      description,
    });

    await newProduct.save();

    res
      .status(201)
      .json({ message: "Product added successfully!", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    if (
      error.message.includes("required") ||
      error.message.includes("number")
    ) {
      return res.status(400).json({ error: error.message });
    }
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

// @desc    Get a single product by ID (for supplier to view their own product)
// @route   GET /api/supplier/myproducts/:id
// @access  Private (Supplier only, ensures they own the product)
const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const supplierId = req.user.id; // From authenticated user

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required." });
    }

    // Find the product and ensure it belongs to the authenticated supplier
    const product = await Product.findOne({
      _id: productId,
      supplier: supplierId,
    });

    if (!product) {
      return res
        .status(404)
        .json({ error: "Product not found or you do not own this product." });
    }

    // CHANGE THIS LINE: Send only the product object
    res.status(200).json(product); // <--- REMOVED THE WRAPPING OBJECT AND MESSAGE

  } catch (error) {
    console.error("Error fetching supplier's product by ID:", error);
    if (error.name === "CastError") {
      // Handle invalid MongoDB ID format
      return res.status(400).json({ error: "Invalid product ID format." });
    }
    res
      .status(500)
      .json({ error: "Failed to fetch product", details: error.message });
  }
};

// @desc    Update an existing product (supplier's own product)
// @route   PUT /api/supplier/myproducts/:id
// @access  Private (Supplier only, ensures they own the product)
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const supplierId = req.user.id; // From authenticated user

    if (!productId) {
      return res
        .status(400)
        .json({ error: "Product ID is required for update." });
    }

    // Find the product and ensure it belongs to the authenticated supplier
    const product = await Product.findOne({
      _id: productId,
      supplier: supplierId,
    });

    if (!product) {
      return res
        .status(404)
        .json({ error: "Product not found or you do not own this product." });
    }

    // Validate incoming data for updates (only if fields are present)
    // If a field is not provided, it won't be updated
    const {
      name,
      category,
      price,
      quantity,
      availability,
      location,
      contact,
      imageUrls,
      description,
    } = req.body;

    if (name !== undefined) product.name = name;
    if (category !== undefined) product.category = category;
    if (price !== undefined) product.price = parseFloat(price);
    if (quantity !== undefined) product.quantity = parseInt(quantity, 10);
    if (availability !== undefined) product.availability = availability;
    if (location !== undefined) product.location = location;
    if (contact !== undefined) product.contact = contact;
    if (imageUrls !== undefined) product.imageUrls = imageUrls;
    if (description !== undefined) product.description = description;

    // Optional: Re-validate the whole product if you modify parts of it
    // product.markModified('location'); // Needed if location subdocument is modified directly
    // product.markModified('contact'); // Needed if contact subdocument is modified directly

    await product.save(); // Save the updated product

    res.status(200).json({ message: "Product updated successfully!", product });
  } catch (error) {
    console.error("Error updating product:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid product ID format." });
    }
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

// @desc    Delete a product (supplier's own product)
// @route   DELETE /api/supplier/myproducts/:id
// @access  Private (Supplier only, ensures they own the product)
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const supplierId = req.user.id; // From authenticated user

    if (!productId) {
      return res
        .status(400)
        .json({ error: "Product ID is required for deletion." });
    }

    const product = await Product.findOneAndDelete({
      _id: productId,
      supplier: supplierId,
    });

    if (!product) {
      return res
        .status(404)
        .json({ error: "Product not found or you do not own this product." });
    }

    res.status(200).json({ message: "Product removed successfully!" });
  } catch (error) {
    console.error("Error deleting product:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid product ID format." });
    }
    res
      .status(500)
      .json({ error: "Failed to delete product", details: error.message });
  }
};

// @desc    Get all products for the authenticated supplier (My Products)
// @route   GET /api/supplier/myproducts
// @access  Private (Supplier only)
const getMyProducts = async (req, res) => {
  try {
    const supplierId = req.user.id; // Get supplier's _id directly from authenticated user
    const products = await Product.find({ supplier: supplierId });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching supplier's products:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch products.", details: error.message });
  }
};

// --- NEW: Get ALL products (public, for customer Browse) ---
// @desc    Get all products (publicly visible)
// @route   GET /api/products (or a separate public API route)
// @access  Public
const getAllProductsPublic = async (req, res) => {
  try {
    const { category } = req.query; // Get category from query parameter (e.g., ?category=Cement)

    let query = {};
    if (category) {
      query.category = category; // Add category filter to the query
    }

    // Fetch products, and crucially, populate the supplier's name and profilePictureUrl
    const products = await Product.find(query).populate(
      "supplier",
      "name username profilePictureUrl"
    ); // Populate supplier's name and profile picture URL

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching all public products:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch products.", details: error.message });
  }
};

// --- NEW: Get single product by ID (public, for customer Browse) ---
// @desc    Get a single product by ID (publicly visible)
// @route   GET /api/products/:id
// @access  Public
const getProductByIdPublic = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(400).json({ error: "Product ID is required." });
    }
    // Populate supplier info including profilePictureUrl
    const product = await Product.findById(productId).populate(
      "supplier",
      "name username email phoneNumber location.text profilePictureUrl" // Added profilePictureUrl
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching public product by ID:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid product ID format." });
    }
    res
      .status(500)
      .json({ error: "Failed to fetch product.", details: error.message });
  }
};

// @desc    Export all products for authenticated supplier to CSV
// @route   GET /api/supplier/products/export-csv
// @access  Private (Supplier only)
const exportProductsToCSV = async (req, res) => {
    try {
        const supplierId = req.user.id; // Get supplier's _id from authenticated user

        const products = await Product.find({ supplier: supplierId }).select('-__v -supplier'); // Exclude some fields

        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found for this supplier to export." });
        }

        // Define fields for the CSV
        // Customize this to include only the fields you want in the CSV
        const fields = [
            { label: 'Product ID', value: '_id' },
            { label: 'Name', value: 'name' },
            { label: 'Category', value: 'category' },
            { label: 'Description', value: 'description' },
            { label: 'Price', value: 'price' },
            { label: 'Quantity', value: 'quantity' },
            { label: 'Availability', value: 'availability' },
            { label: 'Location Text', value: 'location.text' },
            { label: 'Location Lat', value: 'location.lat' },
            { label: 'Location Lng', value: 'location.lng' },
            { label: 'Contact Mobile', value: 'contact.mobile' },
            { label: 'Contact Email', value: 'contact.email' },
            { label: 'Contact Address', value: 'contact.address' },
            // If you want image URLs, they might be an array, so handling is more complex or you pick the first one
            // { label: 'Image URL', value: row => row.imageUrls && row.imageUrls.length > 0 ? row.imageUrls[0] : '' },
            { label: 'Created At', value: 'createdAt' },
        ];

        const csv = json2csv(products.map(p => p.toObject()), { fields }); // Convert Mongoose docs to plain objects

        res.header('Content-Type', 'text/csv');
        res.attachment('my_products.csv'); // Set the download filename
        res.send(csv);

    } catch (error) {
        console.error("Error exporting products to CSV:", error);
        res.status(500).json({ message: "Failed to export products to CSV", error: error.message });
    }
};

module.exports = {
  addProduct,
  getProductById, // CHANGED: Renamed the exported function
  updateProduct,
  deleteProduct,
  getMyProducts,
  getAllProductsPublic,
  getProductByIdPublic,
  exportProductsToCSV,
};
