const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const searchRoutes = require("./routes/searchRoutes");

dotenv.config();

const app = express();

// Connect MongoDB (Atlas)
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Test Route (👈 404 se pehle rakho)
app.get("/", (req, res) => {
  res.send("✅ LearnEase Backend API is running...");
});

// Routes
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const topicRoutes = require("./routes/topicRoutes");
const subtopicRoutes = require("./routes/subtopicRoutes");
const contentRoutes = require("./routes/contentRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/subtopics", subtopicRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/search", searchRoutes);

// 404 Handler (👈 hamesha sabse LAST)
app.use((req, res) => {
  res.status(404).json({
    status: false,
    message: "API Route Not Found",
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
