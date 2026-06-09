import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { channel, body } = req.body;

    const token = req.session?.slackToken;
    if (!token) {
      return res.status(401).json({ error: "Not authenticated with Slack" });
    }

    const response = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ channel, text: body }),
    });

    const data = await response.json();

    if (data.ok) {
      res.json({ success: true });
    } else {
      res.json({ success: false, error: data.error });
    }
  } catch (err) {
    console.error("Send Slack error:", err);
    res.status(500).send(err.message || "Failed to send Slack message");
  }
});

export default router;
