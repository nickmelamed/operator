# Operations Copilot

An AI-powered dashboard that watches your business communications 
and surfaces what needs attention — so you don't have to go looking for it.

## Setup

1. Clone the repo
2. Run `npm install` in the root, `app`, and `api` folders
3. Copy `api/.env.example` to `api/.env` and add your Anthropic API key
4. Run `npm run dev` from the root

## What you'll see

The dashboard loads a sample scenario for a small creative agency. 
It extracts risks, blockers, opportunities, and overdue items, 
then drafts recommended actions you can approve and send in one click.

To test with your own data, paste emails or Slack messages into 
the "Add your own data" section at the bottom.

## Extending this

- **New data sources:** Add a new route in `api/routes/` and a new 
  source pill in the sidebar
- **Real Slack sending:** Replace the simulated response in 
  `api/routes/send-slack.js` with a Slack MCP call (same pattern 
  as the Gmail route)
- **Persistent memory:** Store analyzed signals in a database to 
  track patterns over time
