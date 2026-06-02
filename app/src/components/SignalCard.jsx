const TYPE_STYLES = {
  risk: {
    border: "border-red-500",
    badge: "bg-red-500/10 text-red-400",
    label: "Risk",
  },
  urgency: {
    border: "border-amber-500",
    badge: "bg-amber-500/10 text-amber-400",
    label: "Urgency",
  },
  blocker: {
    border: "border-orange-500",
    badge: "bg-orange-500/10 text-orange-400",
    label: "Blocker",
  },
  opportunity: {
    border: "border-green-500",
    badge: "bg-green-500/10 text-green-400",
    label: "Opportunity",
  },
};

const SOURCE_ICONS = {
  gmail: (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.910 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
    </svg>
  ),
  slack: (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
    </svg>
  ),
  manual: (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
};

export default function SignalCard({ signal }) {
  const styles = TYPE_STYLES[signal.type] || TYPE_STYLES.risk;
  const sourceLabel =
    signal.source === "gmail"
      ? "Gmail"
      : signal.source === "slack"
      ? "Slack"
      : "Manual";

  return (
    <div
      className={`bg-zinc-900 border border-zinc-800 border-l-4 ${styles.border} rounded-lg p-4 flex flex-col gap-2`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles.badge}`}
        >
          {styles.label}
        </span>
        {signal.age && (
          <span className="text-xs text-zinc-500">{signal.age}</span>
        )}
      </div>

      <h3 className="text-sm font-semibold text-zinc-100 leading-snug">
        {signal.title}
      </h3>

      <p className="text-sm text-zinc-400 leading-relaxed">{signal.summary}</p>

      {signal.relatedContact && (
        <p className="text-xs text-zinc-500">{signal.relatedContact}</p>
      )}

      <div className="mt-auto pt-2">
        <span className="inline-flex items-center gap-1 text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">
          {SOURCE_ICONS[signal.source] || SOURCE_ICONS.manual}
          {sourceLabel}
        </span>
      </div>
    </div>
  );
}
