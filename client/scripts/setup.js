const fs = require("fs");
const path = require("path");

const envExamplePath = path.join(__dirname, "..", ".env.example");
const envPath = path.join(__dirname, "..", ".env");

if (!fs.existsSync(envExamplePath)) {
  console.error("❌ .env.example file not found!");
  process.exit(1);
}

if (fs.existsSync(envPath)) {
  console.log("⚠️  .env already exists. Skipping copy.");
} else {
  fs.copyFileSync(envExamplePath, envPath);
  console.log("✅ .env file created from .env.example");
}
