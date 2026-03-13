const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import Feedback Route
const FeedbackRouter = require("./routes/FeedbackRoute");

// Use Route
app.use("/Feedback", FeedbackRouter);

// Test Route
app.get("/", (req, res) => {
    res.send("Backend Running...");
});

// MongoDB URI
const MONGO_URI = "mongodb+srv://gnpkaveeshanirmal_db_user:usqho1JuzjvGGRaZ@cluster0.co1heb0.mongodb.net/?retryWrites=true&w=majority";

// MongoDB Connection
const connectWithRetry = () => {

    console.log("Attempting to connect to MongoDB...");

    mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS: 8000,
        family: 4
    })

    .then(() => {

        console.log("✅ Connected to MongoDB");

        const PORT = 8000;

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

    })

    .catch((err) => {

        console.error("❌ MongoDB connection failed:", err.message);

        console.log("Retrying in 5 seconds...");

        setTimeout(connectWithRetry, 5000);

    });

};

// Start connection
connectWithRetry();