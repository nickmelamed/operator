import { useState, useRef } from "react";
import SignalCard from "./SignalCard.jsx";
import MessageModal from "./MessageModal.jsx";
import {
  DEMO_SIGNALS,
  DEMO_ACTIONS,
  MANUAL_INPUT_TEXT,
  UPDATED_ACME_SIGNAL,
} from "../data/demoData.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const GmailIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
  </svg>
);

const SlackIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
  </svg>
);

function DemoActionCard({ action, clicking }) {
  const isGmail = action.channel === "gmail";
  const firstLine = action.draft?.split("\n")[0] ?? "";
  const preview = firstLine.length > 80 ? firstLine.slice(0, 80) + "…" : firstLine;

  return (
    <div
      className={`bg-zinc-900 border rounded-lg overflow-hidden transition-all duration-300 ${
        clicking
          ? "border-indigo-400 ring-2 ring-indigo-500/30 scale-[1.01]"
          : "border-zinc-800"
      }`}
    >
      <div className="flex items-center gap-3 p-4">
        <span className={`shrink-0 transition-colors duration-300 ${clicking ? "text-indigo-400" : "text-zinc-400"}`}>
          {isGmail ? <GmailIcon /> : <SlackIcon />}
        </span>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium transition-colors duration-300 ${clicking ? "text-white" : "text-zinc-100"}`}>
            {action.label}
          </p>
          <p className="text-xs text-zinc-500 truncate mt-0.5">{preview}</p>
        </div>
        <span className="text-zinc-600 text-xs shrink-0">▼</span>
      </div>
    </div>
  );
}

function scrollContainer() {
  return document.querySelector("main");
}

function scrollToBottom() {
  const c = scrollContainer();
  if (c) c.scrollTo({ top: c.scrollHeight, behavior: "smooth" });
}

function scrollToElement(el) {
  if (!el) return;
  const c = scrollContainer();
  if (!c) return;
  const elRect = el.getBoundingClientRect();
  const cRect = c.getBoundingClientRect();
  const newTop = c.scrollTop + (elRect.top - cRect.top) - 80;
  c.scrollTo({ top: Math.max(0, newTop), behavior: "smooth" });
}

export default function DemoReplay({ onDemoComplete, onManualInputActive }) {
  const [phase, setPhase] = useState("ready");
  const [manualText, setManualText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [signals, setSignals] = useState(DEMO_SIGNALS);
  const [hiddenActions, setHiddenActions] = useState([]);
  const [clickingAction, setClickingAction] = useState(null);
  const [modalAction, setModalAction] = useState(null);

  const actionsRef = useRef(null);
  const manualInputRef = useRef(null);
  const signalsRef = useRef(null);
  const hasStarted = useRef(false);

  const runDemo = async () => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    setPhase("running");

    // 1 — scroll down so viewer sees the full page
    scrollToBottom();
    await sleep(2500);

    // 2 — scroll to manual input textarea
    scrollToElement(manualInputRef.current);
    await sleep(1000);

    // 3 — type meeting notes character by character
    setPhase("typing");
    for (let i = 1; i <= MANUAL_INPUT_TEXT.length; i++) {
      setManualText(MANUAL_INPUT_TEXT.slice(0, i));
      await sleep(12);
    }
    await sleep(600);

    // 4 — fake "Analyze" submission
    setIsAnalyzing(true);
    onManualInputActive?.();
    await sleep(1800);
    setIsAnalyzing(false);

    // 5 — scroll up to signal cards and update Acme Corp card
    setPhase("card_update");
    scrollToElement(signalsRef.current);
    await sleep(900);
    setSignals((prev) => prev.map((s) => (s.id === "sig-acme" ? UPDATED_ACME_SIGNAL : s)));
    await sleep(2200);

    // 6 — scroll to recommended actions
    setPhase("actions");
    scrollToElement(actionsRef.current);
    await sleep(1500);

    // 7 — "click" action 1: Send proposal to Acme Corp
    setClickingAction("act-acme");
    await sleep(500);
    setModalAction(DEMO_ACTIONS[0]);
    await sleep(5000);
    setModalAction(null);
    setClickingAction(null);
    setHiddenActions((prev) => [...prev, "act-acme"]);
    await sleep(2000);

    // 8 — "click" action 3: Follow up with Project Falcon
    setClickingAction("act-falcon");
    await sleep(500);
    setModalAction(DEMO_ACTIONS[2]);
    await sleep(5000);
    setModalAction(null);
    setClickingAction(null);
    setHiddenActions((prev) => [...prev, "act-falcon"]);
    await sleep(2000);

    onDemoComplete?.();
  };

  const visibleActions = DEMO_ACTIONS.filter((a) => !hiddenActions.includes(a.id));
  const isRunning = phase !== "ready";

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div ref={signalsRef} className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">
            Meridian Creative — Monday Brief
          </h1>
          <p className="text-sm text-zinc-500 mt-1">Last scanned: 2 minutes ago</p>
        </div>
        {!isRunning ? (
          <button
            onClick={runDemo}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors"
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            Start Demo
          </button>
        ) : (
          <span className="text-xs text-indigo-400 flex items-center gap-1.5 py-2 px-3 bg-indigo-500/10 rounded-md border border-indigo-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Demo running
          </span>
        )}
      </div>

      {/* Signal cards */}
      <section>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
          This week needs attention
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {signals.map((signal) => (
            <SignalCard
              key={signal.id}
              signal={signal}
              manualUpdate={!!signal.manualUpdate}
            />
          ))}
        </div>
      </section>

      {/* Action cards */}
      <section ref={actionsRef}>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
          Recommended actions
        </h2>
        <div className="flex flex-col gap-2">
          {visibleActions.map((action) => (
            <DemoActionCard
              key={action.id}
              action={action}
              clicking={clickingAction === action.id}
            />
          ))}
        </div>
      </section>

      {/* Manual input */}
      <section ref={manualInputRef} id="custom-data">
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
          value={manualText}
          onChange={() => {}}
        />
        <button
          disabled
          className={`mt-2 text-sm px-4 py-2 rounded-md text-white transition-colors ${
            isAnalyzing ? "bg-indigo-500" : manualText ? "bg-indigo-600" : "bg-indigo-600 opacity-50"
          }`}
        >
          {isAnalyzing ? "Analyzing…" : "Analyze"}
        </button>
      </section>

      {modalAction && <MessageModal action={modalAction} />}
    </div>
  );
}
