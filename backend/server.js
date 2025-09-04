const express = require("express");
const cors = require("cors");
const { LOG } = require("./loggingMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

const urlStore = new Map();

app.post("/shorten", async (req, res) => {
  const { longUrl, validity = 30, shortCode } = req.body;
  try {
    if (!longUrl || !longUrl.startsWith("http")) {
      await LOG("backend", "error", "handler", "invalid URL has been provided");
      return res.status(400).json({ error: "invalid url" });
    }
    let code = shortCode || Math.random().toString(36).substring(2, 7);
    if (urlStore.has(code)) {
      await LOG("backend", "warn", "service", "shortcode collision");
      return res.status(400).json({
        error: "shortcode exists.",
      });
    }

    const expiry = Date.now() + validity * 60 * 1000;
    urlStore.set(code, { longUrl, expiry, clicks: [] });
    const shortUrl = `http://localhost:3000/${code}`;
    await LOG("backend", "info", "service", `shortened Url: ${shortUrl}`);
      res.json({ shortUrl, expiry });
      
  } catch (error) {
    await LOG(
      "backend",
      "fatal",
      "service",
      `Server crashed: ${error.message}`
    );
    res.status(500).json({
      error: "something went wrong in the server",
    });
  }
});



