import express from "express";
import { google } from "googleapis";

const router = express.Router();

function getOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

router.get("/", (req, res) => {
  const oAuth2Client = getOAuthClient();
  const url = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/gmail.readonly"],
    prompt: "consent",
  });
  res.redirect(url);
});

router.get("/callback", async (req, res) => {
  const { code, error } = req.query;
  if (error || !code) {
    return res.redirect("http://localhost:5173?error=google_auth_failed");
  }
  try {
    const oAuth2Client = getOAuthClient();
    const { tokens } = await oAuth2Client.getToken(code);
    req.session.googleTokens = tokens;
    res.redirect("http://localhost:5173?connected=google");
  } catch (err) {
    console.error("Google callback error:", err);
    res.redirect("http://localhost:5173?error=google_auth_failed");
  }
});

router.get("/disconnect", (req, res) => {
  delete req.session.googleTokens;
  res.json({ success: true });
});

router.get("/status", (req, res) => {
  res.json({ connected: !!req.session.googleTokens });
});

export default router;
