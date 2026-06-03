const SLACK_API = "https://slack.com/api";

async function slackGet(endpoint, token, params = {}) {
  const url = new URL(`${SLACK_API}/${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function fetchSlackMessages(token) {
  const channelsData = await slackGet("conversations.list", token, {
    types: "public_channel",
    exclude_archived: "true",
    limit: "100",
  });

  if (!channelsData.ok) throw new Error(channelsData.error);

  const channels = (channelsData.channels || []).filter((c) => c.is_member);
  const since = Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60;
  const messages = [];

  for (const channel of channels.slice(0, 5)) {
    const historyData = await slackGet("conversations.history", token, {
      channel: channel.id,
      oldest: since.toString(),
      limit: "50",
    });

    if (!historyData.ok) continue;

    for (const msg of historyData.messages || []) {
      if (msg.type !== "message" || msg.subtype) continue;
      messages.push({
        id: msg.ts,
        source: "slack",
        timestamp: new Date(parseFloat(msg.ts) * 1000).toISOString(),
        from: msg.user || "unknown",
        channel: `#${channel.name}`,
        body: msg.text || "",
      });
    }
  }

  return messages;
}
