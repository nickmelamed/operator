import { useState, useEffect, useCallback } from "react";
import messages from "../data/scenario.js";

const API = "http://localhost:3001";

export function useOperationsBrief() {
  const [signals, setSignals] = useState([]);
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const runAnalyze = useCallback(async (msgs, customData) => {
    const body = { messages: msgs };
    if (customData) body.customData = customData;

    const res = await fetch(`${API}/api/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }, []);

  // Initial load
  useEffect(() => {
    setLoading(true);
    setError(null);
    runAnalyze(messages)
      .then((data) => {
        setSignals(data.signals || []);
        setActions(
          (data.actions || []).map((a) => ({ ...a, sent: false, edited: false }))
        );
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [runAnalyze]);

  const refreshWithData = useCallback(
    async (customText) => {
      setLoading(true);
      setError(null);
      try {
        const data = await runAnalyze(messages, customText || undefined);
        const newSignals = (data.signals || []).map((s) =>
          customText ? { ...s, source: "manual" } : s
        );
        const newActions = (data.actions || []).map((a) => ({
          ...a,
          sent: false,
          edited: false,
        }));

        setSignals((prev) => {
          const existingTitles = new Set(prev.map((s) => s.title));
          const deduped = newSignals.filter((s) => !existingTitles.has(s.title));
          return [...prev, ...deduped];
        });

        setActions((prev) => {
          const existingIds = new Set(prev.map((a) => a.id));
          const deduped = newActions.filter((a) => !existingIds.has(a.id));
          return [...prev, ...deduped];
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [runAnalyze]
  );

  const sendAction = useCallback(async (action) => {
    try {
      let res;
      if (action.channel === "gmail") {
        res = await fetch(`${API}/api/send-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
              a.id === actionId
                ? { ...a, draft: data.draft, edited: false }
                : a
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
