import { useState, useRef, useEffect } from "react";

const GmailIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.910 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
  </svg>
);

const SlackIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
  </svg>
);

const Spinner = () => (
  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
  </svg>
);

export default function ActionCard({ action, onSend, onUpdateDraft, onRegenerate }) {
  const [expanded, setExpanded] = useState(false);
  const [sending, setSending] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (expanded && textareaRef.current) {
      const el = textareaRef.current;
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  }, [expanded, action.draft]);

  if (action.sent) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 opacity-60 flex items-center gap-3">
        <span className="text-zinc-500">
          {action.channel === "gmail" ? <GmailIcon /> : <SlackIcon />}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-zinc-400">{action.label}</p>
          <p className="text-xs text-zinc-600 truncate">{action.draft}</p>
        </div>
        <span className="text-green-400 text-sm font-medium shrink-0">Sent ✓</span>
      </div>
    );
  }

  const firstLine = action.draft?.split("\n")[0] ?? "";
  const preview = firstLine.length > 80 ? firstLine.slice(0, 80) + "…" : firstLine;

  const handleTextareaChange = (e) => {
    const el = e.target;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
    onUpdateDraft(action.id, el.value);
  };

  const handleSend = async (e) => {
    e.stopPropagation();
    setSending(true);
    await onSend(action);
    setSending(false);
  };

  const handleRegenerate = async (e) => {
    e.stopPropagation();
    setRegenerating(true);
    await onRegenerate(action.id);
    setRegenerating(false);
  };

  return (
    <div
      className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden cursor-pointer"
      onClick={() => setExpanded((v) => !v)}
    >
      {/* Header row */}
      <div className="flex items-center gap-3 p-4">
        <span className="text-zinc-400 shrink-0">
          {action.channel === "gmail" ? <GmailIcon /> : <SlackIcon />}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-zinc-100">{action.label}</p>
            {action.edited && (
              <span className="text-xs bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded-full">
                Edited
              </span>
            )}
          </div>
          {!expanded && (
            <p className="text-xs text-zinc-500 truncate mt-0.5">{preview}</p>
          )}
        </div>
        <span className="text-zinc-600 text-xs shrink-0">
          {expanded ? "▲" : "▼"}
        </span>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 flex flex-col gap-3" onClick={(e) => e.stopPropagation()}>
          <textarea
            ref={textareaRef}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-md text-sm text-zinc-200 p-3 resize-none overflow-hidden focus:outline-none focus:border-zinc-500 leading-relaxed"
            value={action.draft}
            onChange={handleTextareaChange}
            rows={1}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-600">{action.draft?.length ?? 0} chars</span>
            <div className="flex gap-2">
              <button
                className="flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-3 py-1.5 rounded-md transition-colors disabled:opacity-50"
                onClick={handleRegenerate}
                disabled={regenerating || sending}
              >
                {regenerating ? <Spinner /> : (
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )}
                Regenerate draft
              </button>
              <button
                className="flex items-center gap-1.5 text-xs text-white bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-md transition-colors disabled:opacity-50"
                onClick={handleSend}
                disabled={sending || regenerating}
              >
                {sending ? <Spinner /> : null}
                {action.edited ? "Send edited version" : "Approve & Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
