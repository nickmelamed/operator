export const MANUAL_INPUT_TEXT = `Meeting Notes, James Wu (Acme Corp) June 2nd, 2026:
- He needs to see proposal by EOW or he will bail.
- Due to delay, proposal needs to go beyond POC and provide implementation roadmap (up to 1 year)
- Expecting rebate for 1 week of delay.`;

export const DEMO_SIGNALS = [
  {
    id: "sig-acme",
    type: "risk",
    title: "Proposal overdue — Acme Corp",
    summary:
      "You promised James at Acme Corp a proposal by end of last week (May 30). It's now June 2 and he's followed up twice with no reply. This deal is at real risk of going cold if you don't respond today.",
    age: "6 days since original commitment",
    source: "gmail",
    relatedContact: "james.wu@acmecorp.com",
  },
  {
    id: "sig-northstar",
    type: "urgency",
    title: "Invoice #1047 unpaid — Northstar LLC (47 days overdue)",
    summary:
      "Invoice #1047 for the brand identity project was sent April 16, with a 30-day payment window. Northstar acknowledged a reminder on May 12 but still hasn't paid. It's now June 2 — 47 days since the invoice was issued and 17 days past due.",
    age: "17 days overdue",
    source: "gmail",
    relatedContact: "accounts@northstarllc.com",
  },
  {
    id: "sig-falcon",
    type: "blocker",
    title: "Project Falcon is blocked — waiting on client brand assets",
    summary:
      "The client was supposed to send brand assets on May 26. As of May 28, Priya is blocked and nothing has arrived. No one has confirmed a follow-up was sent. This blocker is now at least 7 days old and could be delaying the whole project.",
    age: "7 days",
    source: "slack",
  },
  {
    id: "sig-greenfield",
    type: "opportunity",
    title: "Greenfield hinted at a rebrand project — potential upsell",
    summary:
      "Kate at Greenfield mentioned they might need help with a rebrand and suggested having a conversation. The website project is going well, so the relationship is warm. This is a good moment to follow up before the moment passes.",
    age: "1 day",
    source: "slack",
    relatedContact: "kate.chen@greenfieldco.com",
  },
];

export const UPDATED_ACME_SIGNAL = {
  id: "sig-acme",
  type: "risk",
  title: "Proposal overdue — Acme Corp",
  summary:
    "James Wu requires submission of proposal by EOW or he will bail. Proposal must go beyond POC — include implementation roadmap (up to 1 year). Expecting a rebate for 1 week of delay.",
  age: "6 days since original commitment",
  source: "gmail",
  relatedContact: "james.wu@acmecorp.com",
  manualUpdate: true,
};

export const DEMO_ACTIONS = [
  {
    id: "act-acme",
    label: "Send proposal to Acme Corp",
    channel: "gmail",
    to: "james.wu@acmecorp.com",
    subject: "Re: Project Proposal — Meridian Creative",
    draft: `James,

Apologies for the delay on this — it slipped on my end, and that's entirely on me. I've spent the past few days putting together something comprehensive that I believe will fully address your needs.

Please find attached the full proposal, which now includes:
• Complete project scope and deliverables
• Implementation roadmap across three phases (12 months total)
• Revised pricing, with a one-week credit applied for the delay

I'm confident this gives you everything you need to move forward. Happy to jump on a call this week to walk through it — just say the word.

Best,
Sarah Mitchell
Meridian Creative`,
  },
  {
    id: "act-northstar",
    label: "Chase Northstar LLC for payment",
    channel: "gmail",
    to: "accounts@northstarllc.com",
    subject: "Re: Invoice #1047 — Brand Identity Project",
    draft: `Hi,

Following up on invoice #1047, now 17 days past its due date. I know you mentioned sorting this soon — would you be able to give us a payment date?

Happy to help if there's anything on your end holding things up.

Thanks,
Sarah
Meridian Creative`,
  },
  {
    id: "act-falcon",
    label: "Follow up with Project Falcon client for brand assets",
    channel: "slack",
    to: "#project-falcon",
    draft: `Just flagging that I'm going to reach out to the client today about the brand assets. We've been waiting since May 26 and Priya is blocked. I'll send a direct message and follow up with a call if I don't hear back by EOD. Will keep this channel posted.`,
  },
  {
    id: "act-greenfield",
    label: "Follow up with Greenfield about rebrand",
    channel: "slack",
    to: "#greenfield-account",
    draft: `Kate, really glad to hear you're happy with how the website's coming along! I'd love to find some time to chat about the rebrand — even just an informal 30 minutes to understand what you're thinking. Want to grab a slot this week?`,
  },
];
