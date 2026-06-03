const API = "http://localhost:3001";

function SourceCard({ name, description, connected, alwaysAvailable, onConnect, onDisconnect }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-zinc-100 font-medium text-sm">{name}</p>
        <p className="text-zinc-500 text-xs mt-0.5">{description}</p>
      </div>
      {alwaysAvailable ? (
        <span className="shrink-0 text-xs text-zinc-400 bg-zinc-800 px-2 py-1 rounded">
          Always on
        </span>
      ) : connected ? (
        <div className="shrink-0 flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            Connected
          </span>
          <button
            onClick={onDisconnect}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={onConnect}
          className="shrink-0 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1.5 rounded transition-colors"
        >
          Connect
        </button>
      )}
    </div>
  );
}

export default function ConnectSources({ connectionStatus, onRunScan, onConnectionChange }) {
  const { google: googleConnected, slack: slackConnected } = connectionStatus;
  const anyConnected = googleConnected || slackConnected;

  const handleDisconnect = async (provider) => {
    await fetch(`${API}/api/auth/${provider}/disconnect`, { credentials: "include" });
    onConnectionChange?.();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-100 gap-8 max-w-md mx-auto">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-zinc-100 mb-2">
          Connect your data sources
        </h2>
        <p className="text-zinc-500 text-sm">
          Connect at least one source to run a live scan of your business.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <SourceCard
          name="Gmail"
          description="Scan the last 50 email threads"
          connected={googleConnected}
          onConnect={() => { window.location.href = `${API}/api/auth/google`; }}
          onDisconnect={() => handleDisconnect("google")}
        />
        <SourceCard
          name="Slack"
          description="Scan channels from the last 7 days"
          connected={slackConnected}
          onConnect={() => { window.location.href = `${API}/api/auth/slack`; }}
          onDisconnect={() => handleDisconnect("slack")}
        />
        <SourceCard
          name="Manual input"
          description="Paste your own emails or messages on the main screen"
          alwaysAvailable
        />
      </div>

      {anyConnected && (
        <button
          onClick={onRunScan}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium py-2.5 px-6 rounded-md transition-colors"
        >
          Run first scan
        </button>
      )}
    </div>
  );
}
