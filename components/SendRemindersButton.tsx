"use client";

import { useState } from "react";

function minutesAgo(date: Date) {
  const mins = Math.max(0, Math.round((Date.now() - date.getTime()) / 60000));
  if (mins === 0) return "adesso";
  if (mins === 1) return "1 minuto fa";
  return `${mins} minuti fa`;
}

export default function SendRemindersButton({ count }: { count: number }) {
  const [status, setStatus] = useState<"idle" | "confirming" | "sending" | "done" | "error">("idle");
  const [result, setResult] = useState<{ sent: number; failed: number; total: number } | null>(null);
  const [sentAt, setSentAt] = useState<Date | null>(null);

  async function handleConfirm() {
    setStatus("sending");
    setResult(null);

    try {
      const res = await fetch("/api/admin/reminders", { method: "POST" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setResult(data);
      setSentAt(new Date());
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  const alreadySentRecently = sentAt !== null;

  return (
    <div className="ticket-card rounded-2xl px-4 py-3 mb-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="stub-label mb-1">Promemoria</p>
          <p className="text-sm text-ink-soft">
            {status === "error"
              ? "Errore durante l'invio, riprova."
              : status === "confirming"
              ? alreadySentRecently
                ? `Attenzione: l'hai già inviato ${sentAt ? minutesAgo(sentAt) : ""}. Inviarlo di nuovo manderà un'altra email a ${count} ${count === 1 ? "persona" : "persone"}.`
                : `Sicuro? Verrà inviata una email a ${count} ${count === 1 ? "persona" : "persone"}.`
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
              className={`py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${
                alreadySentRecently
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-accent text-paper-card hover:bg-accent/90"
              }`}
            >
              {alreadySentRecently ? "Invia comunque di nuovo" : "Conferma invio"}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setStatus("confirming")}
            disabled={count === 0 || status === "sending"}
            className={`py-2.5 px-5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap ${
              status === "done"
                ? "border border-ink/15 text-ink-soft hover:border-ink/40 hover:text-ink"
                : "bg-ink text-paper-card hover:bg-ink-soft"
            }`}
          >
            {status === "sending" ? "Invio in corso…" : status === "done" ? "Invia di nuovo" : "Invia promemoria"}
          </button>
        )}
      </div>

      {status === "done" && result && (
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-green-50 border border-green-200 px-3 py-2.5">
          <span className="text-green-600 text-lg leading-none" aria-hidden>✓</span>
          <p className="text-sm text-green-800 font-medium">
            Inviato a {result.sent} su {result.total}
            {result.failed ? ` — ${result.failed} falliti` : ""}, {sentAt ? minutesAgo(sentAt) : ""}.
          </p>
        </div>
      )}
    </div>
  );
}
