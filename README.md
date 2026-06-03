# Operations Copilot

An AI-powered dashboard that watches your business communications 
and surfaces what needs attention — so you don't have to go looking for it.

## Setup

1. Clone the repo
2. Run `npm install` in the root, `app`, and `api` folders
3. Copy `api/.env.example` to `api/.env` and add your Anthropic API key
4. Run `npm run dev` from the root

## What you'll see

The dashboard opens in **Demo mode** — a sample scenario for Meridian 
Creative, a small agency. It extracts risks, blockers, opportunities, 
and overdue items, then drafts recommended actions you can approve and 
send in one click.

Switch to **Live mode** using the toggle in the sidebar to connect your 
own Gmail and Slack accounts.

To test with your own data in either mode, paste emails or Slack 
messages into the "Add your own data" section at the bottom.

## Connecting real sources

Switch the sidebar toggle to **Live**, then connect your data sources:

### Google (Gmail)

1. Go to [Google Cloud Console](https://console.cloud.google.com/) and 
   create a project
2. Enable the **Gmail API** under APIs & Services
3. Create OAuth 2.0 credentials (type: Web application)
4. Add `http://localhost:3001/api/auth/google/callback` as an authorized 
   redirect URI
5. Copy the Client ID and Client Secret into `api/.env`:
   ```
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   ```

### Slack

1. Go to [api.slack.com/apps](https://api.slack.com/apps) and create a 
   new app (From scratch)
2. Under **OAuth & Permissions**, add these Bot Token Scopes:
   - `channels:read`
   - `channels:history`
   - `users:read`
3. Add `http://localhost:3001/api/auth/slack/callback` as a redirect URL
4. Install the app to your workspace
5. Copy the Client ID and Client Secret into `api/.env`:
   ```
   SLACK_CLIENT_ID=your_client_id
   SLACK_CLIENT_SECRET=your_client_secret
   ```

Set a `SESSION_SECRET` in `api/.env` as well (any random string).

Once credentials are set, restart the server, switch to Live mode, 
and click the Connect buttons in the source cards.

## Extending this

- **New data sources:** Add a fetch lib in `api/lib/`, auth routes in 
  `api/routes/auth/`, and a new source card in `ConnectSources.jsx`
- **Real Slack sending:** Replace the simulated response in 
  `api/routes/send-slack.js` with a Slack API call
- **Persistent memory:** Store analyzed signals in a database to 
  track patterns over time
