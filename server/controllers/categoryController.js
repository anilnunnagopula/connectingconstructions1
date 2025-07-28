// server/controllers/categoryController.js
const Category = require("../models/CategoryModel"); // Assuming you have a Mongoose Category model

// @desc    Get all categories for authenticated supplier
// @route   GET /api/supplier/categories
// @access  Private (Supplier only)
exports.getCategories = async (req, res) => {
  try {
    const supplierId = req.user.id; // From 'protect' middleware
    const categories = await Category.find({ supplier: supplierId });
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch categories", error: error.message });
  }
};

// @desc    Add a new category
// @route   POST /api/supplier/categories
// @access  Private (Supplier only)
exports.addCategory = async (req, res) => {
  try {
    const supplierId = req.user.id;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required." });
    }

    const existingCategory = await Category.findOne({
      name,
      supplier: supplierId,
    });
    if (existingCategory) {
      return res
        .status(409)
        .json({
          message: "Category with this name already exists for this supplier.",
        });
    }

    const newCategory = new Category({ name, supplier: supplierId });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error adding category:", error);
    res
      .status(500)
      .json({ message: "Failed to add category", error: error.message });
  }
};

// @desc    Update a category
// @route   PUT /api/supplier/categories/:id
// @access  Private (Supplier only)
exports.updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const supplierId = req.user.id;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required." });
    }

    const category = await Category.findOneAndUpdate(
      { _id: categoryId, supplier: supplierId },
      { name },
      { new: true, runValidators: true } // Return updated doc, run schema validators
    );

    if (!category) {
      return res
        .status(404)
        .json({ message: "Category not found or you do not own it." });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    res
      .status(500)
      .json({ message: "Failed to update category", error: error.message });
  }
};

// @desc    Delete a category
// @route   DELETE /api/supplier/categories/:id
// @access  Private (Supplier only)
exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const supplierId = req.user.id;

    const category = await Category.findOneAndDelete({
      _id: categoryId,
      supplier: supplierId,
    });

    if (!category) {
      return res
        .status(404)
        .json({ message: "Category not found or you do not own it." });
    }
    res.status(200).json({ message: "Category deleted successfully." });
  } catch (error) {
    console.error("Error deleting category:", error);
    res
      .status(500)
      .json({ message: "Failed to delete category", error: error.message });
  }
};
