const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
// app.use(cors());// for local back end
app.use(
  cors({
    origin: [
      "http://localhost:3000", // React local
      "https://connectingconstructions.netlify.app", // Deployed
    ],
    credentials: true,
  })
);

app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("Welcome to ConnectConstructions API");
});
const authRoutes = require("./routes/auth");

app.use("/api/auth", authRoutes);


// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log("MongoDB Error ❌", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
