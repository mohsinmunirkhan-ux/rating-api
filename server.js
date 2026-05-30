const express = require("express");
const gplay = require("google-play-scraper");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/api/rating", async (req, res) => {
  try {
    const appId = req.query.id;
    const data = await gplay.app({ appId: appId });

    res.json({
      rating: data.score.toFixed(1),
      count: data.ratings
    });

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch rating" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));
