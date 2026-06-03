import express from "express";

const router = express.Router();

const SLACK_AUTH_URL = "https://slack.com/oauth/v2/authorize";
const SLACK_TOKEN_URL = "https://slack.com/api/oauth.v2.access";

router.get("/", (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.SLACK_CLIENT_ID,
    redirect_uri: process.env.SLACK_REDIRECT_URI,
    scope: "channels:read,channels:history,users:read",
  });
  res.redirect(`${SLACK_AUTH_URL}?${params}`);
});

router.get("/callback", async (req, res) => {
  const { code, error } = req.query;
  if (error || !code) {
    return res.redirect("http://localhost:5173?error=slack_auth_failed");
  }
  try {
    const response = await fetch(SLACK_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.SLACK_CLIENT_ID,
        client_secret: process.env.SLACK_CLIENT_SECRET,
        redirect_uri: process.env.SLACK_REDIRECT_URI,
      }),
    });
    const data = await response.json();
    if (!data.ok) throw new Error(data.error);
    req.session.slackToken = data.access_token;
    res.redirect("http://localhost:5173?connected=slack");
  } catch (err) {
    console.error("Slack callback error:", err);
    res.redirect("http://localhost:5173?error=slack_auth_failed");
  }
});

router.get("/disconnect", (req, res) => {
  delete req.session.slackToken;
  res.json({ success: true });
});

router.get("/status", (req, res) => {
  res.json({ connected: !!req.session.slackToken });
});

export default router;
