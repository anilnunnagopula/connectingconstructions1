
const mongoose = require("mongoose");
require("dotenv").config({ path: "./server/.env" });

const verifyIndexDrop = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/connect-constructions";
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("Connected.");

    const db = mongoose.connection.db;
    const collection = db.collection("wishlists");
    const indexes = await collection.indexes();
    
    const indexName = "user_1_product_1";
    const userIndexName = "user_1";
    
    const conflicts = indexes.filter(idx => idx.name === indexName || idx.name === userIndexName);

    if (conflicts.length > 0) {
      console.log("Found conflicting indexes:", conflicts.map(i => i.name));
      for (const idx of conflicts) {
        console.log(`Dropping index: ${idx.name}`);
        await collection.dropIndex(idx.name);
        console.log(`Dropped ${idx.name}`);
      }
    } else {
      console.log("No conflicting indexes found. Cleanup successful.");
    }

  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
    process.exit(0);
  }
};

verifyIndexDrop();
