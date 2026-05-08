// Root-level Vercel serverless entrypoint.
// Keeps deployment config simple and avoids custom builds.
try {
  module.exports = require("../Backend/server");
} catch (startupError) {
  console.error("Vercel startup error:", startupError);

  module.exports = (req, res) => {
    res.status(500).json({
      success: false,
      message: "Server startup failed",
      error: startupError.message,
    });
  };
}
