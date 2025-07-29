// server/controllers/syncInventoryController.js
const Product = require("../models/Product"); // Your Product model
const csv = require("csv-parser"); // For CSV parsing
const xlsx = require("xlsx"); // For Excel parsing
const stream = require("stream"); // Node.js stream module

// You'll need to install these:
// npm install csv-parser xlsx multer

// For file uploads, you'll need Multer middleware in your supplierRoutes.js
// Example:
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' }); // Temporary upload directory

// @desc    Sync inventory via file upload
// @route   POST /api/supplier/inventory/sync
// @access  Private (Supplier only)
exports.syncInventory = async (req, res) => {
  try {
    const supplierId = req.user.id; // From 'protect' middleware

    if (!req.file) {
      // req.file comes from multer middleware
      return res.status(400).json({ message: "No file uploaded." });
    }

    const fileBuffer = req.file.buffer; // If using memoryStorage for multer
    const originalname = req.file.originalname;

    const productsToUpdate = [];
    let skippedRows = [];

    if (originalname.endsWith(".csv")) {
      const readableStream = new stream.Readable();
      readableStream.push(fileBuffer);
      readableStream.push(null);

      readableStream
        .pipe(csv())
        .on("data", (row) => {
          // Expects columns like: ProductID,Quantity,Price
          if (row.ProductID && !isNaN(row.Quantity) && !isNaN(row.Price)) {
            productsToUpdate.push({
              _id: row.ProductID.trim(),
              quantity: parseInt(row.Quantity, 10),
              price: parseFloat(row.Price),
            });
          } else {
            skippedRows.push(row);
          }
        })
        .on("end", async () => {
          await processUpdates(productsToUpdate, supplierId, skippedRows, res);
        })
        .on("error", (error) => {
          console.error("CSV parsing error:", error);
          return res.status(400).json({ message: "Error parsing CSV file." });
        });
    } else if (
      originalname.endsWith(".xls") ||
      originalname.endsWith(".xlsx")
    ) {
      const workbook = xlsx.read(fileBuffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = xlsx.utils.sheet_to_json(sheet);

      json.forEach((row) => {
        // Expects columns like: ProductID,Quantity,Price
        if (row.ProductID && !isNaN(row.Quantity) && !isNaN(row.Price)) {
          productsToUpdate.push({
            _id: row.ProductID.trim(),
            quantity: parseInt(row.Quantity, 10),
            price: parseFloat(row.Price),
          });
        } else {
          skippedRows.push(row);
        }
      });
      await processUpdates(productsToUpdate, supplierId, skippedRows, res);
    } else {
      return res
        .status(400)
        .json({
          message:
            "Unsupported file type. Please upload a CSV, XLS, or XLSX file.",
        });
    }
  } catch (error) {
    console.error("Error in syncInventory:", error);
    res
      .status(500)
      .json({ message: "Failed to sync inventory.", error: error.message });
  }
};

// Helper function to process updates after parsing
const processUpdates = async (
  productsToUpdate,
  supplierId,
  skippedRows,
  res
) => {
  let updatedCount = 0;
  let notFoundCount = 0;
  let unauthorizedCount = 0;
  let errorCount = 0;

  for (const productData of productsToUpdate) {
    try {
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: productData._id, supplier: supplierId }, // Find by ID AND ensure supplier owns it
        { quantity: productData.quantity, price: productData.price },
        { new: true, runValidators: true }
      );

      if (updatedProduct) {
        updatedCount++;
      } else {
        const existingProduct = await Product.findById(productData._id);
        if (existingProduct) {
          // Product exists, but doesn't belong to supplier
          unauthorizedCount++;
        } else {
          // Product doesn't exist at all
          notFoundCount++;
        }
      }
    } catch (updateError) {
      console.error(`Error updating product ${productData._id}:`, updateError);
      errorCount++;
    }
  }

  let summaryMessage = `Inventory sync complete. Updated: ${updatedCount} products.`;
  if (notFoundCount > 0) summaryMessage += ` Not found: ${notFoundCount}.`;
  if (unauthorizedCount > 0)
    summaryMessage += ` Not authorized (not your product): ${unauthorizedCount}.`;
  if (errorCount > 0) summaryMessage += ` Errors: ${errorCount}.`;
  if (skippedRows.length > 0)
    summaryMessage += ` Skipped invalid rows: ${skippedRows.length}.`;

  res.status(200).json({
    message: summaryMessage,
    updatedCount,
    notFoundCount,
    unauthorizedCount,
    errorCount,
    skippedRows,
  });
};
