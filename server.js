const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* =======================
   CORS CONFIG (IMPORTANT)
   ======================= */
const frontendUrl =
  "https://portfolio2-4mx2-2jn48qiru-steves-projects-fd8cfd5b.vercel.app";

app.use(
  cors({
    origin: frontendUrl,
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

// Handle preflight requests
app.options("*", cors());

/* =======================
   MIDDLEWARE
   ======================= */
app.use(express.json());

/* =======================
   MONGODB CONNECTION
   ======================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected for Weather App"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

/* =======================
   CITY MODEL
   ======================= */
const citySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  country: { type: String },
});

const City = mongoose.model("City", citySchema);

/* =======================
   ROUTES
   ======================= */

// Health check
app.get("/", (req, res) => {
  res.send("Weather backend is running!");
});

// Get all cities
app.get("/api/cities", async (req, res) => {
  try {
    const cities = await City.find();
    res.json(cities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save city
app.post("/api/cities", async (req, res) => {
  try {
    const { name, country } = req.body;

    const city = new City({ name, country });
    await city.save();

    res.json(city);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "City already exists" });
    }
    res.status(500).json({ error: err.message });
  }
});

// Delete city
app.delete("/api/cities/:id", async (req, res) => {
  try {
    await City.findByIdAndDelete(req.params.id);
    const cities = await City.find();
    res.json(cities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =======================
   START SERVER
   ======================= */
const PORT = process.env.PORT || 5001;
app.listen(PORT, () =>
  console.log(`🚀 Weather App server running on port ${PORT}`)
);
