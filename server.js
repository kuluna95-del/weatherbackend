const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/**
 * ✅ CORS — SIMPLE & CORRECT
 * This is exactly why your Todo app works
 */
app.use(cors());
app.use(express.json());

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// City model
const citySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  country: String,
});

const City = mongoose.model("City", citySchema);

// Test route
app.get("/", (req, res) => {
  res.send("Weather backend running");
});

// API routes
app.get("/api/cities", async (req, res) => {
  const cities = await City.find();
  res.json(cities);
});

app.post("/api/cities", async (req, res) => {
  try {
    const city = new City(req.body);
    await city.save();
    res.json(city);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "City already exists" });
    }
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/cities/:id", async (req, res) => {
  await City.findByIdAndDelete(req.params.id);
  res.json(await City.find());
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
