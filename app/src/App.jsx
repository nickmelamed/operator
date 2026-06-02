import { useState, useRef } from "react";
import ExecutiveBrief from "./components/ExecutiveBrief.jsx";
import ToastStack from "./components/ToastStack.jsx";
import messages, { meta } from "./data/scenario.js";

// Recent subjects/channels from scenario for sidebar popovers
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

export default function App() {
  const briefRef = useRef(null);
  const customInputRef = useRef(null);
  const onAddToastRef = useRef(null);

  const handleManualClick = () => {
    customInputRef.current?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      customInputRef.current?.querySelector("textarea")?.focus();
    }, 300);
  };

  const handleScanNow = () => {
    briefRef.current?.handleRefresh?.();
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-zinc-950 border-r border-zinc-800 flex flex-col p-4 sticky top-0 h-screen">
        <div className="text-sm font-semibold text-zinc-200 tracking-wide mb-6">
          Operations Copilot
        </div>

        <div className="flex flex-col gap-1 flex-1">
          <p className="text-xs text-zinc-600 uppercase tracking-wider px-3 mb-1">
            Sources
          </p>

          <SourcePill label="Gmail" dot="bg-green-400">
            <p className="text-xs text-zinc-500 mb-1 px-1">Recent threads</p>
            {recentEmails.map((s, i) => (
              <p key={i} className="text-xs text-zinc-300 px-1 py-0.5 truncate">
                {s}
              </p>
            ))}
          </SourcePill>

          <SourcePill label="Slack" dot="bg-green-400">
            <p className="text-xs text-zinc-500 mb-1 px-1">Channels scanned</p>
            {recentChannels.map((c, i) => (
              <p key={i} className="text-xs text-zinc-300 px-1 py-0.5">
                {c}
              </p>
            ))}
          </SourcePill>

          <SourcePill label="Manual Input" dot="bg-zinc-500" onClick={handleManualClick} />
        </div>

        <button
          onClick={handleScanNow}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors mt-4"
        >
          Scan now
        </button>
      </aside>

      {/* Main panel */}
      <main className="flex-1 p-8 overflow-y-auto">
        <ExecutiveBrief
          ref={briefRef}
          onAddToastRef={onAddToastRef}
          customInputRef={customInputRef}
        />
      </main>

      <ToastStack addToastRef={onAddToastRef} />
    </div>
  );
}
