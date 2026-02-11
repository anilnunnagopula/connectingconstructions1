
const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables

const dropOldIndex = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/connect-constructions"; // Fallback if no ENV
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB.");

    const db = mongoose.connection.db;
    const collection = db.collection("wishlists");

    console.log("Checking indexes on 'wishlists' collection...");
    const indexes = await collection.indexes();
    console.log("Existing indexes:", JSON.stringify(indexes, null, 2));

    const indexName = "user_1_product_1";
    const indexExists = indexes.some(idx => idx.name === indexName);

    if (indexExists) {
      console.log(`Dropping index '${indexName}'...`);
      await collection.dropIndex(indexName);
      console.log(`Index '${indexName}' dropped successfully. ✅`);
    } else {
      console.log(`Index '${indexName}' does not exist. No action needed.`);
    }

    // Also check if there are other conflicting indexes and drop them if necessary
    // Example: user_1 might conflict with customer_1 if we want to enforce unique customer
    // The new schema defines "customer" as unique. If "user" was unique, we might want to drop it too.
    const userIndexName = "user_1";
    const userIndexExists = indexes.some(idx => idx.name === userIndexName);
    if(userIndexExists) {
        console.log(`Dropping index '${userIndexName}'...`);
        await collection.dropIndex(userIndexName);
        console.log(`Index '${userIndexName}' dropped successfully. ✅`);
    }

  } catch (error) {
    console.error("Error dropping index:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  }
};

dropOldIndex();
