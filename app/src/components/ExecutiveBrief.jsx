import { useState, forwardRef, useImperativeHandle } from "react";
import { useOperationsBrief } from "../hooks/useOperationsBrief.js";
import { meta } from "../data/scenario.js";
import SignalCard from "./SignalCard.jsx";
import ActionCard from "./ActionCard.jsx";

function SkeletonCard() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 animate-pulse">
      <div className="h-3 bg-zinc-800 rounded w-1/4 mb-3" />
      <div className="h-4 bg-zinc-800 rounded w-3/4 mb-2" />
      <div className="h-3 bg-zinc-800 rounded w-full mb-1" />
      <div className="h-3 bg-zinc-800 rounded w-5/6" />
    </div>
  );
}

function SkeletonAction() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 animate-pulse flex gap-3 items-center">
      <div className="w-4 h-4 bg-zinc-800 rounded" />
      <div className="flex-1">
        <div className="h-3 bg-zinc-800 rounded w-1/2 mb-2" />
        <div className="h-3 bg-zinc-800 rounded w-3/4" />
      </div>
    </div>
  );
}

const ExecutiveBrief = forwardRef(function ExecutiveBrief(
  { mode = "demo", onFetchStatus, onAddToastRef, customInputRef },
  ref
) {
  const { signals, actions, loading, error, refreshWithData, sendAction, updateDraft, regenerateDraft } =
    useOperationsBrief(mode, { onFetchStatus });
  const [customText, setCustomText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  const handleRefresh = () => refreshWithData("");

  useImperativeHandle(ref, () => ({ handleRefresh }));

  const handleAnalyze = async () => {
    if (!customText.trim()) return;
    setAnalyzing(true);
    await refreshWithData(customText);
    setCustomText("");
    setAnalyzing(false);
  };

  const handleSend = async (action) => {
    const result = await sendAction(action);
    if (onAddToastRef?.current) {
      if (result.success) {
        onAddToastRef.current(
          `Message sent${action.to ? ` to ${action.to}` : ""}`,
          "success"
        );
      } else {
        onAddToastRef.current("Something went wrong — please try again", "error");
      }
    }
    return result;
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-zinc-400 text-2xl">⚠</div>
        <p className="text-zinc-200 font-medium">Couldn't reach your data sources</p>
        <p className="text-zinc-500 text-sm">Check your connection and API key, then try again.</p>
        <button
          onClick={handleRefresh}
          className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!loading && signals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-zinc-300 text-lg font-medium animate-pulse">
          {mode === "demo" ? meta.businessName : "Your business"}
        </p>
        <p className="text-zinc-500 text-sm">
          Watching your business. First brief will be ready shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">
            {mode === "demo" ? `${meta.businessName} — Monday Brief` : "Live Brief"}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {mode === "demo" ? `Last scanned: ${meta.scanTime}` : "Your connected sources"}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-md transition-colors disabled:opacity-40"
          title="Refresh"
        >
          <svg className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Signals section */}
      <section>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
          This week needs attention
        </h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {signals.map((signal) => (
              <SignalCard key={signal.id} signal={signal} />
            ))}
          </div>
        )}
      </section>

      {/* Actions section */}
      <section>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
          Recommended actions
        </h2>
        {loading ? (
          <div className="flex flex-col gap-2">
            {[...Array(3)].map((_, i) => <SkeletonAction key={i} />)}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {actions.map((action) => (
              <ActionCard
                key={action.id}
                action={action}
                onSend={handleSend}
                onUpdateDraft={updateDraft}
                onRegenerate={regenerateDraft}
              />
            ))}
          </div>
        )}
        {loading && (
          <p className="text-zinc-500 text-sm mt-4 text-center">
            Scanning your business…
          </p>
        )}
      </section>

      {/* Data ingestion section */}
      <section ref={customInputRef} id="custom-data">
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-1">
          Add your own data
        </h2>
        <p className="text-zinc-500 text-sm mb-3">
          Paste emails, Slack messages, or meeting notes
        </p>
        <textarea
          className="w-full bg-zinc-800 border border-zinc-700 rounded-md text-sm text-zinc-200 p-3 resize-y focus:outline-none focus:border-zinc-500 leading-relaxed"
          rows={4}
          placeholder="Paste content here…"
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
        />
        <button
          className="mt-2 text-sm bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2 rounded-md transition-colors"
          onClick={handleAnalyze}
          disabled={analyzing || loading || !customText.trim()}
        >
          {analyzing ? "Analyzing…" : "Analyze"}
        </button>
      </section>
    </div>
  );
});

export default ExecutiveBrief;
