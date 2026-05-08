// Serverless handler for Vercel with startup guard.
// If an import fails during cold start, return a JSON error
// instead of a generic FUNCTION_INVOCATION_FAILED crash page.
try {
  module.exports = require("../server");
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
