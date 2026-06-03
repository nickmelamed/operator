import { google } from "googleapis";

export function createGmailAuth(tokens) {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  oAuth2Client.setCredentials(tokens);
  return oAuth2Client;
}

export async function fetchGmailMessages(tokens, session) {
  const oAuth2Client = createGmailAuth(tokens);

  oAuth2Client.on("tokens", (newTokens) => {
    session.googleTokens = { ...tokens, ...newTokens };
  });

  const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

  const threadsRes = await gmail.users.threads.list({
    userId: "me",
    maxResults: 50,
  });

  const threads = threadsRes.data.threads || [];
  const messages = [];

  for (const thread of threads.slice(0, 15)) {
    const threadData = await gmail.users.threads.get({
      userId: "me",
      id: thread.id,
      format: "full",
    });

    const firstMsg = threadData.data.messages?.[0];
    if (!firstMsg) continue;

    const headers = firstMsg.payload?.headers || [];
    const getHeader = (name) =>
      headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value || "";

    messages.push({
      id: firstMsg.id,
      source: "gmail",
      timestamp: new Date(parseInt(firstMsg.internalDate)).toISOString(),
      from: getHeader("from"),
      subject: getHeader("subject"),
      body: extractBody(firstMsg.payload).slice(0, 2000),
    });
  }

  return messages;
}

function extractBody(payload) {
  if (!payload) return "";
  if (payload.body?.data) {
    return Buffer.from(payload.body.data, "base64").toString("utf-8");
  }
  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === "text/plain" && part.body?.data) {
        return Buffer.from(part.body.data, "base64").toString("utf-8");
      }
    }
    for (const part of payload.parts) {
      if (part.mimeType === "text/html" && part.body?.data) {
        return Buffer.from(part.body.data, "base64")
          .toString("utf-8")
          .replace(/<[^>]+>/g, " ")
          .trim();
      }
    }
  }
  return "";
}
