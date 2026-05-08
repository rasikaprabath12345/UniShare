try {
  // Optional: use .env locally if dotenv is available.
  require("dotenv").config();
} catch (_error) {
  // In Vercel, environment variables come from project settings.
}

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// CORS Configuration
const defaultOrigins = [
  "http://localhost:3000",
  "https://unishare-platform.netlify.app",
  "https://uni-share-theta.vercel.app",
];

const configuredOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// If FRONTEND_URL is set, use only that value (or comma-separated values).
const allowedOrigins = configuredOrigins.length > 0 ? configuredOrigins : defaultOrigins;

const isTrustedPreviewOrigin = (origin) => {
  if (!origin) return false;
  try {
    const hostname = new URL(origin).hostname.toLowerCase();
    // Allow Vercel/Netlify preview domains used during deployment testing.
    return hostname.endsWith(".vercel.app") || hostname.endsWith(".netlify.app");
  } catch (_error) {
    return false;
  }
};

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser clients and same-origin calls
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || isTrustedPreviewOrigin(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
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


// MongoDB Connection - Handle both local and serverless environments
let isConnected = false;
let connectionPromise = null;

const connectToMongoDB = async () => {
  if (isConnected) {
    console.log("✅ Using existing MongoDB connection");
    return true;
  }

  // Prevent multiple simultaneous connection attempts
  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = (async () => {
    try {
      const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
      
      if (!mongoUri) {
        console.warn("⚠️  MongoDB URI not configured - running in demo mode");
        return false;
      }

      console.log("🔄 Attempting to connect to MongoDB...");
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 10000,
        maxPoolSize: 5,
        family: 4,
      });
      isConnected = true;
      console.log("✅ Connected to MongoDB");
      return true;
    } catch (err) {
      console.error("❌ MongoDB connection failed:", err.message);
      isConnected = false;
      return false;
    } finally {
      connectionPromise = null;
    }
  })();

  return connectionPromise;
};

// Initialize connection on first request (for serverless)
app.use(async (req, res, next) => {
  // Try to connect, but don't block if it fails
  if (!isConnected && !connectionPromise) {
    await connectToMongoDB();
  }
  next();
});

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

// Root route for debugging
app.get("/", (req, res) => {
  res.json({
    message: "UniShare Backend API",
    version: "1.0.0",
    status: "Running",
    docs: "/api/health"
  });
});

// Health check route
app.get("/api/health", (req, res) => {
  const dbStatus = isConnected ? "Connected" : "Disconnected";
  res.status(200).json({
    status: "Backend is running",
    database: dbStatus,
    environment: process.env.NODE_ENV || "unknown",
    timestamp: new Date().toISOString()
  });
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