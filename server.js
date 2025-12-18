const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* =======================
   CORS (Vercel frontend)
   ======================= */
const frontendUrl =
  "https://portfolio2-4mx2-2jn48qiru-steves-projects-fd8cfd5b.vercel.app";

app.use(
  cors({
    origin: frontendUrl,
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

/* =======================
   Middleware
   ======================= */
app.use(express.json());

/* =======================
   MongoDB
   ======================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

/* =======================
   Model
   ======================= */
const citySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  country: String,
});

const City = mongoose.model("City", citySchema);

/* =======================
   Routes
   ======================= */
app.get("/", (req, res) => {
  res.send("Weather backend is running!");
});

app.get("/api/cities", async (req, res) => {
  const cities = await City.find();
  res.json(cities);
});

app.post("/api/cities", async (req, res) => {
  try {
    const city = await City.create(req.body);
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

/* =======================
   Start server
   ======================= */
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
