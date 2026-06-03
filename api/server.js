import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import MemoryStore from "memorystore";
import analyzeRoute from "./routes/analyze.js";
import sendEmailRoute from "./routes/send-email.js";
import sendSlackRoute from "./routes/send-slack.js";
import regenerateDraftRoute from "./routes/regenerate-draft.js";
import authGoogleRoute from "./routes/auth/google.js";
import authSlackRoute from "./routes/auth/slack.js";
import fetchGmailRoute from "./routes/fetch/gmail.js";
import fetchSlackRoute from "./routes/fetch/slack.js";

const MemoryStoreSession = MemoryStore(session);
const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret-change-in-prod",
    resave: false,
    saveUninitialized: false,
    store: new MemoryStoreSession({ checkPeriod: 86400000 }),
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use("/api/analyze", analyzeRoute);
app.use("/api/send-email", sendEmailRoute);
app.use("/api/send-slack", sendSlackRoute);
app.use("/api/regenerate-draft", regenerateDraftRoute);
app.use("/api/auth/google", authGoogleRoute);
app.use("/api/auth/slack", authSlackRoute);
app.use("/api/fetch/gmail", fetchGmailRoute);
app.use("/api/fetch/slack", fetchSlackRoute);

app.listen(3001, () => console.log("API running on http://localhost:3001"));
