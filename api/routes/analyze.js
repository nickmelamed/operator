import express from "express";
import Anthropic from "@anthropic-ai/sdk";

const router = express.Router();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are an operations analyst for a small business. You will receive raw messages from Gmail and Slack. Your job is to extract operational signals that the business owner needs to act on today.

Rules:
- Only surface things that are genuinely at risk, overdue, blocked, or a real opportunity. Do not invent problems.
- Write signal titles in plain English. No jargon. Bad: "Commitment deviation detected". Good: "Proposal overdue — Acme Corp".
- Write summaries as if you are a trusted advisor, not a system. Bad: "Email thread indicates pricing not delivered per commitment". Good: "You promised pricing by Friday. It's Monday and they've followed up once with no reply."
- For action drafts, write in first person as the business owner. Warm but professional. Do not start with "I hope this email finds you well." Get to the point in the first sentence.
- Return ONLY valid JSON. No preamble, no markdown fences, no explanation.`;

router.post("/", async (req, res) => {
  try {
    const { messages = [], customData } = req.body;

    const allMessages = [...messages];
    if (customData) {
      allMessages.push({ source: "manual", body: customData });
    }

    const userContent = JSON.stringify(allMessages, null, 2);

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Here are the raw messages from this business's communications:\n\n${userContent}\n\nExtract all operational signals and draft recommended actions.`,
        },
      ],
    });

    let raw = response.content[0].text.trim();
    // Strip accidental markdown fences
    raw = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();

    const parsed = JSON.parse(raw);
    res.json(parsed);
  } catch (err) {
    console.error("Analyze error:", err);
    res.status(500).send(err.message || "Failed to analyze messages");
  }
});

export default router;
