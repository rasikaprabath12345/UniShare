require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// CORS Configuration - Allow your Netlify frontend
const corsOptions = {
  origin: process.env.FRONTEND_URL || [
    "http://localhost:3000",
    "https://unishare-platform.netlify.app", // Your Netlify frontend URL
    "https://uni-share-theta.vercel.app" // Your Vercel backend URL
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import Routes
const FeedbackRouter  = require("./routes/FeedbackRoute");
const QuizRouter      = require("./routes/QuizRoute");
const MaterialRouter  = require("./routes/MaterialRoutes");
const UserRouter = require('./routes/UserRoutes');
const ForumRouter = require('./routes/ForumRoute');
const MeetingRouter = require("./routes/MeetingRoute");
const BookmarkRouter = require("./routes/BookmarkRoute");
const ReportRouter = require('./routes/ReportRoute');

// Pre-load models to ensure schema registration
require("./models/Report");
require("./models/Usermanagement");


// Use Routes
app.use("/Feedback",  FeedbackRouter);
app.use("/quiz",      QuizRouter);
app.use("/uploads",   express.static("uploads"));
app.use("/Materials", MaterialRouter);
app.use("/User", UserRouter);
app.use("/api/users", UserRouter); // API prefix routes
app.use("/Forum", ForumRouter);
app.use("/api/meetings", MeetingRouter);
app.use("/api/bookmarks", BookmarkRouter);
app.use("/api/reports", ReportRouter);

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "Backend is running ✅" });
});

// 404 handler for API routes
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server error"
  });
});

// MongoDB Connection - Handle both local and serverless environments
let isConnected = false;

const connectToMongoDB = async () => {
  if (isConnected) {
    console.log("✅ Using existing MongoDB connection");
    return;
  }

  try {
    console.log("🔄 Attempting to connect to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
      family: 4,
      maxPoolSize: 5,
      socketTimeoutMS: 30000,
    });
    isConnected = true;
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    isConnected = false;
    throw new Error("Database connection failed");
  }
};

// Initialize connection on first request (for serverless)
app.use(async (req, res, next) => {
  if (!isConnected) {
    try {
      await connectToMongoDB();
    } catch (err) {
      console.error("Database initialization error:", err.message);
      return res.status(500).json({
        success: false,
        message: "Database connection failed"
      });
    }
  }
  next();
});

// Export app for Vercel serverless
module.exports = app;

// Local server startup (only for development)
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  const PORT = process.env.PORT || 8000;
  
  connectToMongoDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀 Server running locally on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error("Failed to start local server:", err);
      process.exit(1);
    });
}