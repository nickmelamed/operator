import { useState, useCallback, useEffect, useRef } from "react";

function Toast({ toast, onRemove }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(toast.id), 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border text-sm transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      } ${
        toast.type === "success"
          ? "bg-zinc-900 border-green-600 text-zinc-100"
          : "bg-zinc-900 border-red-600 text-zinc-100"
      }`}
    >
      <span className={toast.type === "success" ? "text-green-400" : "text-red-400"}>
        {toast.type === "success" ? "✓" : "✕"}
      </span>
      {toast.message}
    </div>
  );
}

export function useToast(addToastRef) {
  const [toasts, setToasts] = useState([]);
  const counterRef = useRef(0);

  const addToast = useCallback((message, type = "success") => {
    const id = ++counterRef.current;
    setToasts((prev) => {
      const next = [...prev, { id, message, type }];
      return next.slice(-3);
    });
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Expose addToast via ref so parent components can call it
  useEffect(() => {
    if (addToastRef) addToastRef.current = addToast;
  }, [addToast, addToastRef]);

  return { toasts, addToast, removeToast };
}

export default function ToastStack({ addToastRef }) {
  const { toasts, removeToast } = useToast(addToastRef);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}
