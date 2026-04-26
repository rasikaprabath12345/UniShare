require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
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



// Test Route
app.get("/", (req, res) => {
  res.send("Backend Running...");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
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

// MongoDB Connection
const connectWithRetry = () => {
  console.log("Attempting to connect to MongoDB...");

  mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 8000,
    family: 4,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");

    app.listen(process.env.PORT || 8000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    console.log("Retrying in 8 seconds...");
    setTimeout(connectWithRetry, 8000);
  });
};

connectWithRetry();