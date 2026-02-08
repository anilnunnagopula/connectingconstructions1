// server/controllers/productController.js
const Product = require("../models/Product");
const User = require("../models/User");
const json2csv = require("json2csv").parse;
const {
  applyLean,
  buildBaseQuery,
  paginate,
  getPaginationMeta,
} = require("../utils/queryHelpers");

// ===== HELPER FUNCTIONS =====

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

// ===== SUPPLIER ROUTES (Protected) =====

/**
 * @desc    Add a new product
 * @route   POST /api/supplier/products
 * @access  Private (Supplier only)
 */
const addProduct = async (req, res) => {
  try {
    const supplierId = req.user._id;
    const supplierEmail = req.user.email;
    const supplierName = req.user.name;

    console.log("📦 Adding product for supplier:", supplierId, supplierEmail);

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

    // Validate input
    validateProductInput(req.body);

    // Check for duplicate product name for this supplier
    const existingProduct = await Product.findOne({
      name,
      supplier: supplierId,
      isDeleted: false, // ✨ Only check active products
    });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        error: "You already have a product with this name.",
      });
    }

    const newProduct = new Product({
      supplier: supplierId,
      name,
      category,
      price: parseFloat(price),
      quantity: parseInt(quantity, 10),
      availability: availability !== undefined ? availability : true,
      location,
      contact,
      imageUrls: imageUrls || [],
      description,
    });

    await newProduct.save();

    console.log("✅ Product added:", newProduct._id);

    res.status(201).json({
      success: true,
      message: "Product added successfully!",
      product: newProduct,
    });
  } catch (error) {
    console.error("❌ Error adding product:", error);
    if (
      error.message.includes("required") ||
      error.message.includes("number")
    ) {
      return res.status(400).json({ success: false, error: error.message });
    }
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: errors,
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to add product",
      details: error.message,
    });
  }
};

/**
 * @desc    Get a single product by ID (supplier's own)
 * @route   GET /api/supplier/myproducts/:id
 * @access  Private (Supplier only)
 */
const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const supplierId = req.user._id;

    if (!productId) {
      return res.status(400).json({
        success: false,
        error: "Product ID is required.",
      });
    }

    // ✨ Use lean() for read-only query
    const product = await Product.findOne({
      _id: productId,
      supplier: supplierId,
      isDeleted: false, // ✨ Exclude deleted
    }).lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found or you do not own this product.",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("❌ Error fetching supplier's product by ID:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid product ID format.",
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to fetch product",
      details: error.message,
    });
  }
};

/**
 * @desc    Update an existing product
 * @route   PUT /api/supplier/myproducts/:id
 * @access  Private (Supplier only)
 */
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const supplierId = req.user._id;

    if (!productId) {
      return res.status(400).json({
        success: false,
        error: "Product ID is required for update.",
      });
    }

    // Find product (need full Mongoose doc for save)
    const product = await Product.findOne({
      _id: productId,
      supplier: supplierId,
      isDeleted: false, // ✨ Can't update deleted products
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found or you do not own this product.",
      });
    }

    // Update fields
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

    await product.save();

    console.log("✅ Product updated:", product._id);

    res.status(200).json({
      success: true,
      message: "Product updated successfully!",
      product,
    });
  } catch (error) {
    console.error("❌ Error updating product:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid product ID format.",
      });
    }
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: errors,
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to update product",
      details: error.message,
    });
  }
};

/**
 * @desc    Delete a product (soft delete)
 * @route   DELETE /api/supplier/myproducts/:id
 * @access  Private (Supplier only)
 */
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const supplierId = req.user._id;

    if (!productId) {
      return res.status(400).json({
        success: false,
        error: "Product ID is required for deletion.",
      });
    }

    const product = await Product.findOne({
      _id: productId,
      supplier: supplierId,
      isDeleted: false,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found or you do not own this product.",
      });
    }

    // ✨ Soft delete instead of hard delete
    await product.softDelete();

    console.log("🗑️  Product soft-deleted:", product._id);

    res.status(200).json({
      success: true,
      message: "Product removed successfully!",
    });
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid product ID format.",
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to delete product",
      details: error.message,
    });
  }
};

/**
 * @desc    Get all products for authenticated supplier
 * @route   GET /api/supplier/myproducts
 * @access  Private (Supplier only)
 */
const getMyProducts = async (req, res) => {
  try {
    const supplierId = req.user._id;

    // ✨ Use lean() for performance + exclude deleted
    const products = await Product.find({
      supplier: supplierId,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("❌ Error fetching supplier's products:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch products.",
      details: error.message,
    });
  }
};

/**
 * @desc    Export products to CSV
 * @route   GET /api/supplier/products/export-csv
 * @access  Private (Supplier only)
 */
const exportProductsToCSV = async (req, res) => {
  try {
    const supplierId = req.user._id;

    const products = await Product.find({
      supplier: supplierId,
      isDeleted: false, // ✨ Only export active products
    })
      .select("-__v -supplier")
      .lean();

    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found to export.",
      });
    }

    const fields = [
      { label: "Product ID", value: "_id" },
      { label: "Name", value: "name" },
      { label: "Category", value: "category" },
      { label: "Description", value: "description" },
      { label: "Price", value: "price" },
      { label: "Quantity", value: "quantity" },
      { label: "Availability", value: "availability" },
      { label: "Location Text", value: "location.text" },
      { label: "Location Lat", value: "location.lat" },
      { label: "Location Lng", value: "location.lng" },
      { label: "Contact Mobile", value: "contact.mobile" },
      { label: "Contact Email", value: "contact.email" },
      { label: "Contact Address", value: "contact.address" },
      { label: "Created At", value: "createdAt" },
    ];

    const csv = json2csv(products, { fields });

    res.header("Content-Type", "text/csv");
    res.attachment("my_products.csv");
    res.send(csv);
  } catch (error) {
    console.error("❌ Error exporting products to CSV:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export products to CSV",
      error: error.message,
    });
  }
};

// ===== PUBLIC ROUTES =====

/**
 * @desc    Get all products (public with pagination & filters)
 * @route   GET /api/products
 * @access  Public
 */
const getAllProductsPublic = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      search,
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    // Build query filters
    const filters = buildBaseQuery(); // { isDeleted: false }

    // Category filter
    if (category) {
      filters.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = parseFloat(minPrice);
      if (maxPrice) filters.price.$lte = parseFloat(maxPrice);
    }

    // Search filter (text search on name and description)
    if (search) {
      filters.$text = { $search: search };
    }

    // Only show available products
    filters.availability = true;
    filters.quantity = { $gt: 0 };

    // Build sort
    const sort = {};
    sort[sortBy] = order === "asc" ? 1 : -1;

    // Execute query with pagination and lean()
    const query = Product.find(filters)
      .populate("supplier", "name username profilePictureUrl")
      .sort(sort)
      .select("-__v");

    const paginatedQuery = paginate(query, parseInt(page), parseInt(limit));
    const products = await applyLean(paginatedQuery);

    // Get pagination metadata
    const pagination = await getPaginationMeta(
      Product,
      filters,
      parseInt(page),
      parseInt(limit),
    );

    res.status(200).json({
      success: true,
      data: products,
      pagination,
    });
  } catch (error) {
    console.error("❌ Error fetching all public products:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch products.",
      details: error.message,
    });
  }
};

/**
 * @desc    Get single product by ID (public)
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductByIdPublic = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!productId) {
      return res.status(400).json({
        success: false,
        error: "Product ID is required.",
      });
    }

    // ✨ Use lean() + exclude deleted
    const product = await Product.findOne({
      _id: productId,
      isDeleted: false,
    })
      .populate(
        "supplier",
        "name username email phoneNumber location.text profilePictureUrl",
      )
      .lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("❌ Error fetching public product by ID:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid product ID format.",
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to fetch product.",
      details: error.message,
    });
  }
};

module.exports = {
  addProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getMyProducts,
  getAllProductsPublic,
  getProductByIdPublic,
  exportProductsToCSV,
};
