import express from "express";
import { fetchSlackMessages } from "../../lib/slack.js";

const router = express.Router();

router.get("/", async (req, res) => {
  if (!req.session.slackToken) {
    return res.status(401).json({ error: "Not connected to Slack" });
  }
  try {
    const messages = await fetchSlackMessages(req.session.slackToken);
    res.json(messages);
  } catch (err) {
    console.error("Slack fetch error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
