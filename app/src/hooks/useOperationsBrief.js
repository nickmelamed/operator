import { useState, useEffect, useCallback } from "react";
import scenarioMessages from "../data/scenario.js";

const API = "http://localhost:3001";

export function useOperationsBrief(mode = "demo") {
  const [signals, setSignals] = useState([]);
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runAnalyze = useCallback(
    async (msgs, customData) => {
      const body = { messages: msgs, mode };
      if (customData) body.customData = customData;

      const res = await fetch(`${API}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    [mode]
  );

  // Auto-load demo on mount; reset when mode changes
  useEffect(() => {
    setSignals([]);
    setActions([]);
    setError(null);

    if (mode !== "demo") {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    runAnalyze(scenarioMessages)
      .then((data) => {
        if (cancelled) return;
        setSignals(data.signals || []);
        setActions(
          (data.actions || []).map((a) => ({ ...a, sent: false, edited: false }))
        );
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [mode, runAnalyze]);

  // No customText → full scan, replaces state. With customText → adds/dedupes.
  const refreshWithData = useCallback(
    async (customText) => {
      setLoading(true);
      setError(null);
      try {
        const msgs = mode === "demo" ? scenarioMessages : [];
        const data = await runAnalyze(msgs, customText || undefined);

        const newSignals = (data.signals || []).map((s) =>
          customText ? { ...s, source: "manual" } : s
        );
        const newActions = (data.actions || []).map((a) => ({
          ...a,
          sent: false,
          edited: false,
        }));

        if (customText) {
          setSignals((prev) => {
            const existingTitles = new Set(prev.map((s) => s.title));
            return [...prev, ...newSignals.filter((s) => !existingTitles.has(s.title))];
          });
          setActions((prev) => {
            const existingIds = new Set(prev.map((a) => a.id));
            return [...prev, ...newActions.filter((a) => !existingIds.has(a.id))];
          });
        } else {
          setSignals(newSignals);
          setActions(newActions);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [mode, runAnalyze]
  );

  const sendAction = useCallback(async (action) => {
    try {
      let res;
      if (action.channel === "gmail") {
        res = await fetch(`${API}/api/send-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            to: action.to,
            subject: action.subject,
            body: action.draft,
          }),
        });
      } else {
        res = await fetch(`${API}/api/send-slack`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ channel: action.to, body: action.draft }),
        });
      }

      const data = await res.json();
      if (data.success) {
        setActions((prev) =>
          prev.map((a) => (a.id === action.id ? { ...a, sent: true } : a))
        );
        return { success: true };
      }
      return { success: false };
    } catch {
      return { success: false };
    }
  }, []);

  const updateDraft = useCallback((actionId, newDraft) => {
    setActions((prev) =>
      prev.map((a) =>
        a.id === actionId ? { ...a, draft: newDraft, edited: true } : a
      )
    );
  }, []);

  const regenerateDraft = useCallback(
    async (actionId) => {
      const action = actions.find((a) => a.id === actionId);
      if (!action) return;
      const signal = signals.find((s) => s.id === action.signalId);

      try {
        const res = await fetch(`${API}/api/regenerate-draft`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            signalSummary: signal?.summary ?? "",
            channel: action.channel,
            originalDraft: action.draft,
            contact: action.to,
          }),
        });

        const data = await res.json();
        if (data.draft) {
          setActions((prev) =>
            prev.map((a) =>
              a.id === actionId ? { ...a, draft: data.draft, edited: false } : a
            )
          );
        }
      } catch (err) {
        console.error("Regenerate error:", err);
      }
    },
    [actions, signals]
  );

  return {
    signals,
    actions,
    loading,
    error,
    refreshWithData,
    sendAction,
    updateDraft,
    regenerateDraft,
  };
}
