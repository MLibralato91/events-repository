"use client";

import { useState } from "react";

export default function SendRemindersButton({ count }: { count: number }) {
  const [status, setStatus] = useState<"idle" | "confirming" | "sending" | "done" | "error">("idle");
  const [result, setResult] = useState<{ sent: number; failed: number; total: number } | null>(null);

  async function handleConfirm() {
    setStatus("sending");
    setResult(null);

    try {
      const res = await fetch("/api/admin/reminders", { method: "POST" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setResult(data);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="ticket-card rounded-2xl px-4 py-3 mb-8 flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="stub-label mb-1">Promemoria</p>
        <p className="text-sm text-ink-soft">
          {status === "done" && result
            ? `Inviato a ${result.sent} su ${result.total}${result.failed ? ` — ${result.failed} falliti` : ""}.`
            : status === "error"
            ? "Errore durante l'invio, riprova."
            : status === "confirming"
            ? `Sicuro? Verrà inviata una email a ${count} ${count === 1 ? "persona" : "persone"}.`
            : `Invia l'email di promemoria a chi ha confermato la presenza (${count}).`}
        </p>
      </div>

      {status === "confirming" ? (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="py-2.5 px-4 rounded-lg border border-ink/15 text-sm font-medium text-ink-soft hover:border-ink/40 hover:text-ink transition-colors whitespace-nowrap"
          >
            Annulla
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="py-2.5 px-4 rounded-lg bg-accent text-paper-card text-sm font-semibold hover:bg-accent/90 transition-colors whitespace-nowrap"
          >
            Conferma invio
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setStatus("confirming")}
          disabled={count === 0 || status === "sending"}
          className="py-2.5 px-5 rounded-lg bg-ink text-paper-card text-sm font-semibold hover:bg-ink-soft transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {status === "sending" ? "Invio in corso…" : "Invia promemoria"}
        </button>
      )}
    </div>
  );
}
