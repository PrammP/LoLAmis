const express = require("express");
const axios = require("axios");
const app = express();
const port = 5500;

app.use(express.static("public"));

app.get("/api/champions", async (req, res) => {
  try {
    const response = await axios.get(
      "https://ddragon.leagueoflegends.com/cdn/14.17.1/data/fr_FR/champion.json"
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch champion data" });
  }
});

app.get("/api/champions/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `https://ddragon.leagueoflegends.com/cdn/14.17.1/data/fr_FR/champion/${req.params.id}.json`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch champion details" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
