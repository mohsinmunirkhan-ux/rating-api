const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

// Test endpoint - just to confirm API is working
app.get("/", (req, res) => {
  res.json({ status: "API is working" });
});

// Debug endpoint - shows raw error
app.get("/api/rating", async (req, res) => {
  try {
    const appId = req.query.id || "com.esoftstudio.allahmuhammadnames";

    const response = await fetch(
      `https://play.google.com/store/apps/details?id=${appId}&hl=en&gl=US`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
        }
      }
    );

    // Return status for debugging
    if (!response.ok) {
      return res.json({ 
        debug: "Fetch failed",
        status: response.status,
        statusText: response.statusText
      });
    }

    const html = await response.text();

    // Return first 500 chars for debugging
    return res.json({
      debug: "Fetch succeeded",
      htmlPreview: html.substring(0, 500)
    });

  } catch (error) {
    // Return exact error message
    res.status(500).json({ 
      debug: "Exception caught",
      error: error.message,
      stack: error.stack
    });
  }
});

module.exports = app;
