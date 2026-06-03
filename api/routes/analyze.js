import express from "express";
import Anthropic from "@anthropic-ai/sdk";
import { fetchGmailMessages } from "../lib/gmail.js";
import { fetchSlackMessages } from "../lib/slack.js";

const router = express.Router();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are an operations analyst for a small business. You will receive raw messages from Gmail and Slack. Your job is to extract operational signals that the business owner needs to act on today.

Rules:
- Only surface things that are genuinely at risk, overdue, blocked, or a real opportunity. Do not invent problems.
- Write signal titles in plain English. No jargon. Bad: "Commitment deviation detected". Good: "Proposal overdue — Acme Corp".
- Write summaries as if you are a trusted advisor, not a system. Bad: "Email thread indicates pricing not delivered per commitment". Good: "You promised pricing by Friday. It's Monday and they've followed up once with no reply."
- For action drafts, write in first person as the business owner. Warm but professional. Do not start with "I hope this email finds you well." Get to the point in the first sentence.
- For each signal, set "source" to match the source field of the message(s) that produced it: "gmail", "slack", or "manual". If a signal spans both gmail and slack messages, use whichever is the primary source.
- Return ONLY valid JSON. No preamble, no markdown fences, no explanation.

Return this exact shape:
{
  "signals": [
    {
      "id": "signal-1",
      "title": "string",
      "summary": "string",
      "type": "risk" | "urgency" | "blocker" | "opportunity",
      "age": "string, e.g. '3 days old'",
      "source": "gmail" | "slack" | "manual",
      "relatedContact": "string or null"
    }
  ],
  "actions": [
    {
      "id": "action-1",
      "signalId": "signal-1",
      "label": "string",
      "channel": "gmail" | "slack",
      "to": "string",
      "subject": "string or null",
      "draft": "string"
    }
  ]
}`;

router.post("/", async (req, res) => {
  try {
    const { messages = [], customData, mode = "demo" } = req.body;

    let allMessages = [...messages];
    const fetchStatus = { gmail: "skipped", slack: "skipped" };

    if (mode === "live") {
      const [gmailResult, slackResult] = await Promise.allSettled([
        req.session?.googleTokens
          ? fetchGmailMessages(req.session.googleTokens, req.session)
          : Promise.resolve(null),
        req.session?.slackToken
          ? fetchSlackMessages(req.session.slackToken)
          : Promise.resolve(null),
      ]);

      if (gmailResult.status === "fulfilled" && gmailResult.value !== null) {
        allMessages = [...allMessages, ...gmailResult.value];
        fetchStatus.gmail = "ok";
      } else if (gmailResult.status === "rejected") {
        fetchStatus.gmail = "failed";
        console.error("Gmail fetch failed:", gmailResult.reason);
      }

      if (slackResult.status === "fulfilled" && slackResult.value !== null) {
        allMessages = [...allMessages, ...slackResult.value];
        fetchStatus.slack = "ok";
      } else if (slackResult.status === "rejected") {
        fetchStatus.slack = "failed";
        console.error("Slack fetch failed:", slackResult.reason);
      }
    }

    if (customData) {
      allMessages.push({ source: "manual", body: customData });
    }

    if (allMessages.length === 0) {
      return res.json({ signals: [], actions: [], fetchStatus });
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
    res.json({
      signals: parsed.signals || [],
      actions: parsed.actions || [],
      ...(mode === "live" && { fetchStatus }),
    });
  } catch (err) {
    console.error("Analyze error:", err);
    res.status(500).send(err.message || "Failed to analyze messages");
  }
});

export default router;
