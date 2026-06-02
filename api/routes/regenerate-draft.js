import express from "express";
import Anthropic from "@anthropic-ai/sdk";

const router = express.Router();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

router.post("/", async (req, res) => {
  try {
    const { signalSummary, channel, originalDraft, contact } = req.body;

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 400,
      system: `You are drafting a business communication for a small business owner.
Write a fresh version of the provided message — same intent, different wording.
Keep it concise, warm, and direct. Do not start with "I hope this email finds you well."
Get to the point in the first sentence. Return only the message body.
No subject line. No sign-off. No explanation.`,
      messages: [
        {
          role: "user",
          content: `Here is the context: ${signalSummary}. Here is the original draft: ${originalDraft}. Please write a fresh version.`,
        },
      ],
    });

    const draft = response.content[0].text.trim();
    res.json({ draft });
  } catch (err) {
    console.error("Regenerate draft error:", err);
    res.status(500).send(err.message || "Failed to regenerate draft");
  }
});

export default router;
