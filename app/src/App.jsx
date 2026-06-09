import { useState, useRef, useCallback, useEffect } from "react";
import ExecutiveBrief from "./components/ExecutiveBrief.jsx";
import DemoReplay from "./components/DemoReplay.jsx";
import ConnectSources from "./components/ConnectSources.jsx";
import ToastStack from "./components/ToastStack.jsx";
import messages from "./data/scenario.js";

const API = "http://localhost:3001";

const recentEmails = messages
  .filter((m) => m.source === "gmail" && m.subject)
  .slice(-3)
  .map((m) => m.subject);

const recentChannels = [
  ...new Set(messages.filter((m) => m.source === "slack").map((m) => m.channel)),
].slice(0, 3);

function SourcePill({ label, dot, children, onClick }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-md hover:bg-zinc-800 transition-colors text-sm text-zinc-300"
        onClick={() => {
          setOpen((v) => !v);
          onClick?.();
        }}
      >
        <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
        {label}
      </button>
      {open && children && (
        <div className="absolute left-full top-0 ml-2 w-56 bg-zinc-800 border border-zinc-700 rounded-lg p-2 shadow-xl z-10">
          {children}
        </div>
      )}
    </div>
  );
}

function sourceDot(connected, fetchResult) {
  if (!connected) return "bg-zinc-500";
  if (fetchResult === "failed") return "bg-amber-400";
  return "bg-green-400";
}

export default function App() {
  const briefRef = useRef(null);
  const customInputRef = useRef(null);
  const onAddToastRef = useRef(null);

  const [mode, setMode] = useState("demo");
  const [connectionStatus, setConnectionStatus] = useState({ google: false, slack: false });
  const [fetchStatus, setFetchStatus] = useState({ gmail: null, slack: null });
  const [liveScanned, setLiveScanned] = useState(false);
  const [manualInputActive, setManualInputActive] = useState(false);

  const fetchConnectionStatus = useCallback(async () => {
    try {
      const [google, slack] = await Promise.all([
        fetch(`${API}/api/auth/google/status`, { credentials: "include" }).then((r) => r.json()),
        fetch(`${API}/api/auth/slack/status`, { credentials: "include" }).then((r) => r.json()),
      ]);
      setConnectionStatus({ google: google.connected, slack: slack.connected });
    } catch {
      // silently ignore — demo mode doesn't need these endpoints
    }
  }, []);

  // Fetch connection status when entering live mode
  useEffect(() => {
    if (mode === "live") {
      fetchConnectionStatus();
    }
  }, [mode, fetchConnectionStatus]);

  // Handle OAuth redirect back (?connected=google|slack or ?error=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("connected")) {
      setMode("live");
      fetchConnectionStatus();
      window.history.replaceState({}, "", "/");
    } else if (params.has("error")) {
      window.history.replaceState({}, "", "/");
    }
  }, [fetchConnectionStatus]);

  // After "Run first scan" mounts ExecutiveBrief, trigger the scan
  useEffect(() => {
    if (mode === "live" && liveScanned) {
      briefRef.current?.handleRefresh?.();
    }
  }, [liveScanned, mode]);

  const switchMode = (newMode) => {
    if (newMode === mode) return;
    if (newMode === "demo") {
      setLiveScanned(false);
      setFetchStatus({ gmail: null, slack: null });
    }
    setManualInputActive(false);
    setMode(newMode);
  };

  const handleFetchStatus = useCallback((status) => {
    setFetchStatus(status);
  }, []);

  const handleManualClick = () => {
    customInputRef.current?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      customInputRef.current?.querySelector("textarea")?.focus();
    }, 300);
  };

  const handleScanNow = () => {
    briefRef.current?.handleRefresh?.();
  };

  const gmailDot =
    mode === "demo"
      ? "bg-green-400"
      : sourceDot(connectionStatus.google, fetchStatus.gmail);

  const slackDot =
    mode === "demo"
      ? "bg-green-400"
      : sourceDot(connectionStatus.slack, fetchStatus.slack);

  const showConnectSources = mode === "live" && !liveScanned;

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      <aside className="w-60 shrink-0 bg-zinc-950 border-r border-zinc-800 flex flex-col p-4 sticky top-0 h-screen">
        <div className="text-sm font-semibold text-zinc-200 tracking-wide mb-5">
          Operations Copilot
        </div>

        {/* Demo / Live toggle */}
        <div className="flex rounded-md bg-zinc-900 border border-zinc-800 p-0.5 mb-5">
          <button
            className={`flex-1 text-xs py-1.5 rounded transition-colors font-medium ${
              mode === "demo"
                ? "bg-zinc-700 text-zinc-100"
                : "text-zinc-500 hover:text-zinc-400"
            }`}
            onClick={() => switchMode("demo")}
          >
            Demo
          </button>
          <button
            className={`flex-1 text-xs py-1.5 rounded transition-colors font-medium ${
              mode === "live"
                ? "bg-zinc-700 text-zinc-100"
                : "text-zinc-500 hover:text-zinc-400"
            }`}
            onClick={() => switchMode("live")}
          >
            Live
          </button>
        </div>

        <div className="flex flex-col gap-1 flex-1">
          <p className="text-xs text-zinc-600 uppercase tracking-wider px-3 mb-1">
            Sources
          </p>

          <SourcePill label="Gmail" dot={gmailDot}>
            {mode === "demo" ? (
              <>
                <p className="text-xs text-zinc-500 mb-1 px-1">Recent threads</p>
                {recentEmails.map((s, i) => (
                  <p key={i} className="text-xs text-zinc-300 px-1 py-0.5 truncate">
                    {s}
                  </p>
                ))}
              </>
            ) : connectionStatus.google ? (
              fetchStatus.gmail === "failed" ? (
                <p className="text-xs text-amber-400 px-1">Connected — last fetch failed</p>
              ) : (
                <p className="text-xs text-zinc-300 px-1">Connected</p>
              )
            ) : (
              <p className="text-xs text-zinc-500 px-1">
                Not connected.{" "}
                <a href={`${API}/api/auth/google`} className="text-indigo-400 hover:underline">
                  Connect
                </a>
              </p>
            )}
          </SourcePill>

          <SourcePill label="Slack" dot={slackDot}>
            {mode === "demo" ? (
              <>
                <p className="text-xs text-zinc-500 mb-1 px-1">Channels scanned</p>
                {recentChannels.map((c, i) => (
                  <p key={i} className="text-xs text-zinc-300 px-1 py-0.5">
                    {c}
                  </p>
                ))}
              </>
            ) : connectionStatus.slack ? (
              fetchStatus.slack === "failed" ? (
                <p className="text-xs text-amber-400 px-1">Connected — last fetch failed</p>
              ) : (
                <p className="text-xs text-zinc-300 px-1">Connected</p>
              )
            ) : (
              <p className="text-xs text-zinc-500 px-1">
                Not connected.{" "}
                <a href={`${API}/api/auth/slack`} className="text-indigo-400 hover:underline">
                  Connect
                </a>
              </p>
            )}
          </SourcePill>

          <SourcePill
            label="Manual Input"
            dot={manualInputActive ? "bg-green-400" : "bg-zinc-500"}
            onClick={handleManualClick}
          />
        </div>

        <button
          onClick={handleScanNow}
          disabled={showConnectSources}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors mt-4"
        >
          Scan now
        </button>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        {showConnectSources ? (
          <ConnectSources
            connectionStatus={connectionStatus}
            onRunScan={() => setLiveScanned(true)}
            onConnectionChange={fetchConnectionStatus}
          />
        ) : mode === "demo" ? (
          <DemoReplay
            onManualInputActive={() => setManualInputActive(true)}
            onDemoReset={() => setManualInputActive(false)}
          />
        ) : (
          <ExecutiveBrief
            ref={briefRef}
            mode={mode}
            onFetchStatus={handleFetchStatus}
            onAddToastRef={onAddToastRef}
            customInputRef={customInputRef}
          />
        )}
      </main>

      <ToastStack addToastRef={onAddToastRef} />
    </div>
  );
}
