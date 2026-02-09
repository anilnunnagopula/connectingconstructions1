// server/scripts/migrateProducts.js
require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");

const MONGO_URI = process.env.MONGO_URI;

async function migrateProducts() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Update all existing products
    const result = await Product.updateMany(
      {
        $or: [{ productType: { $exists: false } }, { productType: null }],
      },
      {
        $set: {
          productType: "material", // Default to material
          unit: "bags", // Default unit
          minOrderQuantity: 1,
          stepSize: 1,
          isQuoteOnly: false,
        },
      },
    );

    console.log(`✅ Migrated ${result.modifiedCount} products`);

    // Log sample products
    const samples = await Product.find().limit(3);
    console.log("\n📦 Sample products after migration:");
    samples.forEach((p) => {
      console.log({
        name: p.name,
        productType: p.productType,
        unit: p.unit,
        isQuoteOnly: p.isQuoteOnly,
      });
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrateProducts();
