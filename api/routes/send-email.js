import express from "express";
import Anthropic from "@anthropic-ai/sdk";

const router = express.Router();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

router.post("/", async (req, res) => {
  try {
    const { to, subject, body } = req.body;

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      system:
        "You are a mail-sending assistant. Use the Gmail tool to send exactly the email provided. Do not modify the content. Do not add any additional commentary.",
      mcp_servers: [
        {
          type: "url",
          url: "https://gmailmcp.googleapis.com/mcp/v1",
          name: "gmail-mcp",
        },
      ],
      messages: [
        {
          role: "user",
          content: `Please send an email to ${to} with subject '${subject}' and the following body: ${body}`,
        },
      ],
    });

    const confirmed = response.content.some(
      (block) => block.type === "mcp_tool_result"
    );

    if (confirmed) {
      res.json({ success: true });
    } else {
      res.json({ success: false, error: "Send not confirmed" });
    }
  } catch (err) {
    console.error("Send email error:", err);
    res.status(500).send(err.message || "Failed to send email");
  }
});

export default router;
