import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import analyzeRoute from "./routes/analyze.js";
import sendEmailRoute from "./routes/send-email.js";
import sendSlackRoute from "./routes/send-slack.js";
import regenerateDraftRoute from "./routes/regenerate-draft.js";

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/analyze", analyzeRoute);
app.use("/api/send-email", sendEmailRoute);
app.use("/api/send-slack", sendSlackRoute);
app.use("/api/regenerate-draft", regenerateDraftRoute);

app.listen(3001, () => console.log("API running on http://localhost:3001"));
