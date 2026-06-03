import express from "express";
import { fetchGmailMessages } from "../../lib/gmail.js";

const router = express.Router();

router.get("/", async (req, res) => {
  if (!req.session.googleTokens) {
    return res.status(401).json({ error: "Not connected to Google" });
  }
  try {
    const messages = await fetchGmailMessages(req.session.googleTokens, req.session);
    res.json(messages);
  } catch (err) {
    console.error("Gmail fetch error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
