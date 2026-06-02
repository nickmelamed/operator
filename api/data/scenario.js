const messages = [
  // Thread 1 — Gmail, Acme Corp proposal
  {
    id: "email-001",
    source: "gmail",
    timestamp: "2026-05-27T10:14:00Z",
    from: "james.wu@acmecorp.com",
    subject: "Re: Project Proposal",
    body: "Hey, just wanted to follow up on the proposal — do you have a number for us yet?",
  },
  {
    id: "email-002",
    source: "gmail",
    timestamp: "2026-05-27T14:32:00Z",
    from: "sarah@meridiancreative.co",
    subject: "Re: Project Proposal",
    body: "Absolutely, I'll have everything put together and sent over by end of week.",
  },
  {
    id: "email-003",
    source: "gmail",
    timestamp: "2026-06-02T09:05:00Z",
    from: "james.wu@acmecorp.com",
    subject: "Re: Project Proposal",
    body: "Just checking in — still waiting on that proposal. Let me know if you need anything from our end.",
  },

  // Thread 2 — Gmail, Northstar LLC invoice
  {
    id: "email-004",
    source: "gmail",
    timestamp: "2026-04-16T08:00:00Z",
    from: "billing@meridiancreative.co",
    subject: "Invoice #1047 — Brand Identity Project",
    body: "Please find attached invoice #1047 for the brand identity project. Payment due within 30 days.",
  },
  {
    id: "email-005",
    source: "gmail",
    timestamp: "2026-05-12T11:20:00Z",
    from: "accounts@northstarllc.com",
    subject: "Re: Invoice #1047 — Brand Identity Project",
    body: "Thanks for the reminder — we'll get this sorted soon.",
  },

  // Thread 3 — Slack, #project-falcon
  {
    id: "slack-001",
    source: "slack",
    timestamp: "2026-05-26T09:00:00Z",
    from: "tom.barrett",
    channel: "#project-falcon",
    body: "Heads up — client said they'd send over the brand assets today so we can get started.",
  },
  {
    id: "slack-002",
    source: "slack",
    timestamp: "2026-05-28T10:45:00Z",
    from: "priya.mehta",
    channel: "#project-falcon",
    body: "Nothing yet — I'm blocked until I have those files. Can someone follow up?",
  },

  // Thread 4 — Slack, #greenfield-account
  {
    id: "slack-003",
    source: "slack",
    timestamp: "2026-06-01T16:30:00Z",
    from: "marcus.lee",
    channel: "#greenfield-account",
    body: "Good call with Greenfield today — they're happy with progress on the website.",
  },
  {
    id: "slack-004",
    source: "slack",
    timestamp: "2026-06-01T16:52:00Z",
    from: "kate.chen@greenfieldco.com",
    channel: "#greenfield-account",
    body: "Yes really pleased with how it's going! By the way, we might need some help with the rebrand too — worth a conversation at some point.",
  },
];

export const meta = {
  businessName: "Meridian Creative",
  scanTime: "2 minutes ago",
};

export default messages;
