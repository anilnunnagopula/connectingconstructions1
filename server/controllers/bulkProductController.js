const Product = require("../models/Product");
const csv = require("csv-parser");
const xlsx = require("xlsx");
const { Readable } = require("stream");

/**
 * Bulk upload products from CSV/Excel file
 * Expected columns: name, category, productType, price, quantity, unit, description,
 *                   brand, grade, packaging, hsnCode, gstRate, minOrderQuantity
 *
 * Optional columns: warranty, countryOfOrigin, certifications (comma-separated)
 */
const bulkUploadProducts = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }

    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname.toLowerCase();
    let parsedRows = [];

    // Parse CSV or Excel
    if (fileName.endsWith(".csv")) {
      parsedRows = await parseCSV(fileBuffer);
    } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
      parsedRows = parseExcel(fileBuffer);
    } else {
      return res.status(400).json({
        success: false,
        error: "Unsupported file format. Use .csv, .xlsx, or .xls",
      });
    }

    if (parsedRows.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No valid data found in the file",
      });
    }

    // Process and validate each row
    const results = {
      total: parsedRows.length,
      created: 0,
      errors: [],
    };

    for (let i = 0; i < parsedRows.length; i++) {
      const row = parsedRows[i];
      const rowNum = i + 2; // +2 because row 1 is header, data starts at 2

      try {
        const validated = validateRow(row, rowNum);
        if (validated.error) {
          results.errors.push({ row: rowNum, error: validated.error });
          continue;
        }

        const productData = {
          supplier: req.user._id,
          name: validated.name,
          category: validated.category,
          productType: validated.productType || "material",
          price: validated.price,
          quantity: validated.quantity || 0,
          unit: validated.unit || "units",
          description: validated.description || `${validated.name} - ${validated.category}`,
          brand: validated.brand || "",
          grade: validated.grade || "",
          packaging: validated.packaging || "",
          hsnCode: validated.hsnCode || "",
          gstRate: validated.gstRate || 18,
          minOrderQuantity: validated.minOrderQuantity || 1,
          warranty: validated.warranty || "",
          countryOfOrigin: validated.countryOfOrigin || "India",
          certifications: validated.certifications || [],
          availability: true,
        };

        // Set isQuoteOnly for services
        if (productData.productType === "service") {
          productData.isQuoteOnly = true;
          productData.quantity = 0;
        }

        const product = new Product(productData);
        await product.save();
        results.created++;
      } catch (err) {
        results.errors.push({
          row: rowNum,
          error: err.message || "Failed to create product",
        });
      }
    }

    res.status(200).json({
      success: true,
      data: results,
      message: `${results.created} of ${results.total} products created successfully`,
    });
  } catch (error) {
    console.error("Bulk upload error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process bulk upload",
      details: error.message,
    });
  }
};

/**
 * Download CSV template for bulk product upload
 */
const downloadBulkTemplate = (req, res) => {
  const headers = [
    "name",
    "category",
    "productType",
    "price",
    "quantity",
    "unit",
    "description",
    "brand",
    "grade",
    "packaging",
    "hsnCode",
    "gstRate",
    "minOrderQuantity",
    "warranty",
    "countryOfOrigin",
    "certifications",
  ];

  const sampleRows = [
    [
      "UltraTech OPC 53 Grade",
      "Cement",
      "material",
      "380",
      "500",
      "bags",
      "Premium quality OPC 53 grade cement",
      "UltraTech",
      "OPC 53",
      "50kg bag",
      "2523",
      "28",
      "10",
      "6 months",
      "India",
      "BIS,ISO 9001",
    ],
    [
      "Tata Tiscon Fe500D TMT Bars",
      "Reinforcement Bars",
      "material",
      "56000",
      "50",
      "tonnes",
      "High strength TMT bars for construction",
      "Tata Tiscon",
      "Fe500D",
      "12mm dia",
      "7214",
      "18",
      "1",
      "1 year",
      "India",
      "BIS,ISO 9001",
    ],
    [
      "Vastu Consultation",
      "Vastu",
      "service",
      "5000",
      "",
      "",
      "Complete vastu consultation for residential and commercial projects",
      "",
      "",
      "",
      "",
      "18",
      "",
      "",
      "India",
      "",
    ],
  ];

  const csvContent = [
    headers.join(","),
    ...sampleRows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=bulk_products_template.csv");
  res.send(csvContent);
};

// ==================== HELPERS ====================

function parseCSV(buffer) {
  return new Promise((resolve, reject) => {
    const rows = [];
    const stream = Readable.from(buffer.toString());

    stream
      .pipe(csv())
      .on("data", (row) => rows.push(row))
      .on("end", () => resolve(rows))
      .on("error", (err) => reject(err));
  });
}

function parseExcel(buffer) {
  const workbook = xlsx.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(sheet);
}

function validateRow(row, rowNum) {
  // Normalize keys (trim whitespace, lowercase)
  const normalized = {};
  Object.keys(row).forEach((key) => {
    normalized[key.trim().toLowerCase()] = (row[key] || "").toString().trim();
  });

  const name = normalized.name || normalized.productname || normalized["product name"];
  const category = normalized.category;
  const price = parseFloat(normalized.price);

  if (!name) return { error: "Missing product name" };
  if (!category) return { error: "Missing category" };
  if (isNaN(price) || price < 0) return { error: "Invalid price" };

  const quantity = parseInt(normalized.quantity) || 0;
  const gstRate = parseFloat(normalized.gstrate || normalized["gst rate"] || normalized.gst) || 18;
  const minOrder = parseInt(normalized.minorderquantity || normalized["min order quantity"] || normalized.moq) || 1;

  // Parse certifications from comma-separated string
  const certStr = normalized.certifications || "";
  const certifications = certStr ? certStr.split(",").map((c) => c.trim()).filter(Boolean) : [];

  return {
    name,
    category,
    productType: normalized.producttype || normalized["product type"] || "material",
    price,
    quantity,
    unit: normalized.unit || "units",
    description: normalized.description || "",
    brand: normalized.brand || "",
    grade: normalized.grade || "",
    packaging: normalized.packaging || "",
    hsnCode: normalized.hsncode || normalized["hsn code"] || normalized.hsn || "",
    gstRate,
    minOrderQuantity: minOrder,
    warranty: normalized.warranty || "",
    countryOfOrigin: normalized.countryoforigin || normalized["country of origin"] || "India",
    certifications,
  };
}

module.exports = {
  bulkUploadProducts,
  downloadBulkTemplate,
};
