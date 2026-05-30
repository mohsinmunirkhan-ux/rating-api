module.exports = async (req, res) => {
  try {
    const appId = req.query.id || "com.esoftstudio.allahmuhammadnames";

    const response = await fetch(
      `https://play.google.com/store/apps/details?id=${appId}&hl=en&gl=US`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9"
        }
      }
    );

    const html = await response.text();

    // Extract rating
    const ratingMatch = html.match(/"starRating":\s*"?(\d+\.\d+)"?/);
    const countMatch = html.match(/"ratingCount":\s*"?(\d+)"?/);

    const rating = ratingMatch?.[1] || null;
    const count = countMatch?.[1] || null;

    if (!rating || !count) {
      return res.status(404).json({ error: "Could not extract rating data" });
    }

    res.json({
      rating: parseFloat(rating).toFixed(1),
      count: parseInt(count)
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
