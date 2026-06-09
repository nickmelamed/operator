import { useState, useRef } from "react";
import { createPortal } from "react-dom";
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

function getScroller() {
  const main = document.querySelector("main");
  if (main && main.scrollHeight > main.clientHeight + 4) return main;
  return window;
}

function scrollerScrollTo(options) {
  const s = getScroller();
  s.scrollTo(options);
}

function scrollerScrollHeight() {
  const s = getScroller();
  if (s === window) return document.body.scrollHeight;
  return s.scrollHeight;
}

function scrollToBottom() {
  scrollerScrollTo({ top: scrollerScrollHeight(), behavior: "smooth" });
}

function scrollToTop() {
  scrollerScrollTo({ top: 0, behavior: "smooth" });
}

function scrollToElement(el) {
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ── Overlay components (all rendered via portal to document.body) ──────────

function WelcomeOverlay({ onStart }) {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-zinc-950/90 backdrop-blur-sm">
      <div className="text-center max-w-sm px-8">
        <h1 className="text-3xl font-bold text-white mb-3">
          Welcome to Your Operations CoPilot
        </h1>
        <p className="text-zinc-400 mb-8 leading-relaxed">
          See how AI-powered insights from Gmail &amp; Slack transform your daily operations.
        </p>
        <button
          onClick={onStart}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-8 rounded-lg transition-colors text-sm"
        >
          Start Demo
        </button>
      </div>
    </div>
  );
}

function SpotlightOverlay({ rects, message }) {
  if (!rects || rects.length === 0) return null;

  const pad = 6;
  const top = Math.min(...rects.map((r) => r.top)) - pad;
  const left = Math.min(...rects.map((r) => r.left)) - pad;
  const right = Math.max(...rects.map((r) => r.right)) + pad;
  const bottom = Math.max(...rects.map((r) => r.bottom)) + pad;
  const centerY = (top + bottom) / 2;

  return (
    <>
      {/* Spotlight cutout via box-shadow trick */}
      <div
        style={{
          position: "fixed",
          top,
          left,
          width: right - left,
          height: bottom - top,
          boxShadow: "0 0 0 9999px rgba(9,9,11,0.82)",
          borderRadius: "8px",
          zIndex: 60,
          pointerEvents: "none",
          border: "1.5px solid rgba(99,102,241,0.5)",
        }}
      />
      {/* Callout tooltip to the right of the sidebar */}
      <div
        style={{
          position: "fixed",
          top: centerY - 30,
          left: right + 16,
          zIndex: 61,
          maxWidth: "280px",
          pointerEvents: "none",
        }}
        className="bg-zinc-800 border border-indigo-500/40 rounded-xl px-4 py-3 shadow-xl"
      >
        {/* Arrow pointing left toward spotlight */}
        <div
          style={{
            position: "absolute",
            left: -7,
            top: "50%",
            transform: "translateY(-50%)",
            width: 0,
            height: 0,
            borderTop: "7px solid transparent",
            borderBottom: "7px solid transparent",
            borderRight: "7px solid rgb(39,39,42)",
          }}
        />
        <p className="text-sm text-zinc-100 leading-relaxed">{message}</p>
      </div>
    </>
  );
}

function StepCallout({ message }) {
  return (
    <div
      className="fixed z-60 pointer-events-none"
      style={{ bottom: 32, right: 32, maxWidth: 300 }}
    >
      <div className="bg-zinc-900 border-l-2 border-l-indigo-500 border border-zinc-700 rounded-lg px-4 py-3 shadow-xl">
        <p className="text-sm text-zinc-200 leading-relaxed">{message}</p>
      </div>
    </div>
  );
}

function FinaleOverlay() {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-zinc-950/90 backdrop-blur-sm pointer-events-none">
      <div className="text-center max-w-sm px-8">
        <h2 className="text-2xl font-bold text-white mb-3">Excited?</h2>
        <p className="text-zinc-300 text-lg leading-relaxed">
          Try it out with your own data on the{" "}
          <span className="text-indigo-400 font-semibold">Live Tab</span>
        </p>
      </div>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────

export default function DemoReplay({ onManualInputActive, onDemoReset, gmailPillRef, slackPillRef }) {
  const [phase, setPhase] = useState("ready");
  const [manualText, setManualText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [signals, setSignals] = useState(DEMO_SIGNALS);
  const [hiddenActions, setHiddenActions] = useState([]);
  const [clickingAction, setClickingAction] = useState(null);
  const [modalAction, setModalAction] = useState(null);
  const [overlayState, setOverlayState] = useState({ type: "welcome" });

  const actionsRef = useRef(null);
  const manualInputRef = useRef(null);
  const signalsRef = useRef(null);
  const hasStarted = useRef(false);

  const runDemo = async () => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const blockScroll = (e) => e.preventDefault();
    const main = document.querySelector("main");
    if (main) {
      main.addEventListener("wheel", blockScroll, { passive: false });
      main.addEventListener("touchmove", blockScroll, { passive: false });
    }
    window.addEventListener("wheel", blockScroll, { passive: false });
    window.addEventListener("touchmove", blockScroll, { passive: false });

    try {
      // 0 — dismiss welcome, spotlight Gmail + Slack in the sidebar
      setOverlayState(null);
      await sleep(300);

      const gmailRect = gmailPillRef?.current?.getBoundingClientRect();
      const slackRect = slackPillRef?.current?.getBoundingClientRect();
      const spotlightRects = [gmailRect, slackRect].filter((r) => r && r.width > 0);

      if (spotlightRects.length > 0) {
        setOverlayState({
          type: "spotlight",
          rects: spotlightRects,
          message: "After integrating Gmail & Slack, here's your Operations Dashboard",
        });
        await sleep(3200);
        setOverlayState(null);
        await sleep(400);
      }

      setPhase("running");

      // 1 — show full page by scrolling to bottom
      scrollToBottom();
      await sleep(2500);

      // 2 — scroll to manual input textarea
      scrollToElement(manualInputRef.current);
      await sleep(1000);

      setOverlayState({
        type: "callout",
        message: "Add meeting notes or emails — the AI enriches your signals automatically",
      });
      await sleep(1400);

      // 3 — type meeting notes character by character
      setPhase("typing");
      for (let i = 1; i <= MANUAL_INPUT_TEXT.length; i++) {
        setManualText(MANUAL_INPUT_TEXT.slice(0, i));
        await sleep(12);
      }
      await sleep(600);

      // 4 — fake "Analyze" submission
      setIsAnalyzing(true);
      setOverlayState({ type: "callout", message: "Analyzing your input alongside Gmail & Slack data…" });
      onManualInputActive?.();
      await sleep(1800);
      setIsAnalyzing(false);
      setOverlayState(null);

      // 5 — scroll up to signal cards and show updated Acme Corp card
      setPhase("card_update");
      scrollToElement(signalsRef.current);
      await sleep(900);
      setSignals((prev) => prev.map((s) => (s.id === "sig-acme" ? UPDATED_ACME_SIGNAL : s)));
      setOverlayState({ type: "callout", message: "Signal updated with context from your meeting notes" });
      await sleep(2200);
      setOverlayState(null);

      // 6 — scroll to recommended actions
      setPhase("actions");
      scrollToElement(actionsRef.current);
      setOverlayState({ type: "callout", message: "AI drafts the right message for each action — one click to send" });
      await sleep(1500);
      setOverlayState(null);

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

      // 9 — finale
      setOverlayState({ type: "finale" });
      await sleep(4000);

      // 10 — scroll back to top, then reset to initial state
      scrollToTop();
      await sleep(1000);

      setPhase("ready");
      setManualText("");
      setIsAnalyzing(false);
      setSignals(DEMO_SIGNALS);
      setHiddenActions([]);
      setClickingAction(null);
      setModalAction(null);
      hasStarted.current = false;
      onDemoReset?.();
      setOverlayState({ type: "welcome" });
    } finally {
      if (main) {
        main.removeEventListener("wheel", blockScroll);
        main.removeEventListener("touchmove", blockScroll);
      }
      window.removeEventListener("wheel", blockScroll);
      window.removeEventListener("touchmove", blockScroll);
    }
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
        {isRunning && (
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

      {/* Overlay portal */}
      {overlayState &&
        createPortal(
          <>
            {overlayState.type === "welcome" && <WelcomeOverlay onStart={runDemo} />}
            {overlayState.type === "spotlight" && (
              <SpotlightOverlay rects={overlayState.rects} message={overlayState.message} />
            )}
            {overlayState.type === "callout" && <StepCallout message={overlayState.message} />}
            {overlayState.type === "finale" && <FinaleOverlay />}
          </>,
          document.body
        )}
    </div>
  );
}
