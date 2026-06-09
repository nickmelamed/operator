# Operations Copilot

An AI-powered dashboard that watches your business communications 
and surfaces what needs attention — so you don't have to go looking for it.

## Setup

1. Clone the repo
2. Run `npm install` in the root, `app`, and `api` folders
3. Copy `api/.env.example` to `api/.env` and fill in your credentials
4. Run `npm run dev` from the root

The app runs on `http://localhost:5173` (frontend) and `http://localhost:3001` (API).

## What it does

Operations Copilot reads your recent Gmail and Slack activity, uses Claude to 
extract operational signals (risks, blockers, urgencies, opportunities), and 
drafts recommended business communications for each one. You review the drafts, 
optionally edit them, and send in one click.

**Core loop:**
1. Fetch — pulls recent Gmail threads and Slack messages
2. Analyze — Claude identifies signals requiring attention
3. Draft — Claude writes a recommended email or Slack message per signal
4. Approve — edit the draft if needed, then send directly from the dashboard
5. Regenerate — ask Claude to rewrite any draft you're not happy with

## Modes

### Demo mode (default)

Loads a pre-built scenario for Meridian Creative, a fictional agency, with 
four signals already extracted (overdue proposal, past-due invoice, project 
blocker, upsell opportunity).

An interactive guided walkthrough plays automatically:
- Spotlights the Gmail and Slack source pills
- Types sample manual input character-by-character
- Triggers a re-analysis that updates the Acme Corp signal
- Auto-clicks two action cards to show the send flow
- Ends with a prompt to switch to Live mode

The demo can be exited at any time with the "Exit demo" button, or replayed 
from the beginning.

### Live mode

Connects to your real Gmail and Slack accounts via OAuth. Requires at least 
one source connected before running a scan. Manual input is always available 
as a supplement regardless of connection status.

Switch between modes using the toggle in the sidebar.

## Adding your own data

Both modes include an "Add your own data" section at the bottom of the page. 
Paste raw emails, Slack messages, or meeting notes — no special formatting 
required. Click **Analyze** to merge those signals into the current board. 
Signals sourced from manual input are marked with a "Manual" badge and 
highlighted on the card.

## Signal and action cards

**Signal cards** show the title, a one-line summary, type badge (Risk / 
Urgency / Blocker / Opportunity), source (Gmail / Slack / Manual), and 
relative age.

**Action cards** show an AI-drafted message for each signal. From an action 
card you can:
- Expand to read and edit the full draft
- Click **Approve & Send** to send it immediately via Gmail or Slack
- Click **Regenerate draft** to have Claude rewrite it with different wording
- Send an edited version (the card shows an "Edited" badge when you've made changes)

Sent actions are marked as complete and stay visible on the board. A toast 
notification confirms success or failure after each send.

A message preview modal appears after sending, showing what was delivered.

## Connecting real sources

Switch the sidebar toggle to **Live**, then connect your data sources.

### Google (Gmail)

1. Go to [Google Cloud Console](https://console.cloud.google.com/) and 
   create a project
2. Enable the **Gmail API** under APIs & Services
3. Create OAuth 2.0 credentials (type: Web application)
4. Add `http://localhost:3001/api/auth/google/callback` as an authorized 
   redirect URI
5. Add to `api/.env`:
   ```
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   ```

Scopes requested: `gmail.readonly`, `gmail.send`

### Slack

1. Go to [api.slack.com/apps](https://api.slack.com/apps) and create a 
   new app (From scratch)
2. Under **OAuth & Permissions**, add these Bot Token Scopes:
   - `channels:read`
   - `channels:history`
   - `users:read`
   - `chat:write`
3. Add `http://localhost:3001/api/auth/slack/callback` as a redirect URL
4. Install the app to your workspace
5. Add to `api/.env`:
   ```
   SLACK_CLIENT_ID=your_client_id
   SLACK_CLIENT_SECRET=your_client_secret
   ```

### Session secret

Set a random string in `api/.env`:
```
SESSION_SECRET=any_random_string
```

Sessions last 7 days. Once credentials are set, restart the server, switch 
to Live mode, and click the Connect buttons in the source cards. Each source 
can be disconnected independently from the same UI.

## Full list of environment variables

```
ANTHROPIC_API_KEY=          # Claude API key
GOOGLE_CLIENT_ID=           # Google OAuth client ID
GOOGLE_CLIENT_SECRET=       # Google OAuth client secret
SLACK_CLIENT_ID=            # Slack OAuth client ID
SLACK_CLIENT_SECRET=        # Slack OAuth client secret
SESSION_SECRET=             # Any random string for session encryption
```

## Extending this

- **New data sources:** Add a fetch lib in `api/lib/`, auth routes in 
  `api/routes/auth/`, and a new source card in `ConnectSources.jsx`
- **Persistent signals:** Store analyzed signals in a database to track 
  patterns over time
- **Production sessions:** Replace the in-memory session store in 
  `api/server.js` with a persistent store (Redis, database, etc.)
