const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/api/rating", async (req, res) => {
  try {
    const appId = req.query.id;

    if (!appId) {
      return res.status(400).json({ error: "App ID is required" });
    }

    // Fetch Google Play page directly
    const response = await fetch(
      `https://play.google.com/store/apps/details?id=${appId}&hl=en&gl=US`
    );

    if (!response.ok) {
      return res.status(404).json({ error: "App not found" });
    }

    const html = await response.text();

    // Extract rating
    const ratingMatch = html.match(/(\d+\.\d+)<\/span>\s*<\/div>\s*<div[^>]*>\s*<div[^>]*star/);
    const countMatch = html.match(/([\d,]+)\s*ratings/i);

    // Alternative patterns if above fails
    const ratingMatch2 = html.match(/"starRating":\s*"?(\d+\.\d+)"?/);
    const countMatch2 = html.match(/"ratingCount":\s*"?(\d+)"?/);

    const rating = ratingMatch?.[1] || ratingMatch2?.[1] || null;
    const count = countMatch?.[1]?.replace(/,/g, "") || countMatch2?.[1] || null;

    if (!rating || !count) {
      return res.status(404).json({ error: "Could not extract rating data" });
    }

    res.json({
      rating: parseFloat(rating).toFixed(1),
      count: parseInt(count)
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;
