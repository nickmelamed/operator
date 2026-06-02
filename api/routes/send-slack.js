import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  // TODO: wire Slack MCP when available
  const { channel, body } = req.body;
  console.log(`[SLACK SIMULATED] ${channel}: ${body}`);
  res.json({ success: true, simulated: true });
});

export default router;
