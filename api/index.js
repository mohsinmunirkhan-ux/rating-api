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

    // Search for rating-related text
    const lines = html
      .split("\n")
      .filter(line => 
        line.includes("rating") || 
        line.includes("Rating") ||
        line.includes("star") ||
        line.includes("review")
      )
      .slice(0, 20); // first 20 matching lines

    res.json({
      status: response.status,
      matchingLines: lines
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
