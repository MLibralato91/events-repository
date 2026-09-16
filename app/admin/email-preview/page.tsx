import Link from "next/link";
import {
  buildConfirmHtml,
  buildReminderHtml,
  buildAdminNotificationHtml,
} from "@/lib/resend";

// ─── Dati d'esempio — solo per l'anteprima, non toccano email reali ───────
const SAMPLE_NOME = "Giorgia";

const adminNotificationFragment = buildAdminNotificationHtml({
  nome: SAMPLE_NOME,
  cognome: "Molinari",
  email: "giorgia@example.it",
  partecipa: true,
  accompagnato: true,
  nome_accompagnatore: "Marco Rossi",
  note: "Sono intollerante al lattosio",
});

const TEMPLATES = [
  {
    label: "Conferma — Sì (con accompagnatore)",
    html: buildConfirmHtml(SAMPLE_NOME, true, true, "Marco Rossi"),
    height: 620,
  },
  {
    label: "Conferma — No",
    html: buildConfirmHtml(SAMPLE_NOME, false, false, null),
    height: 380,
  },
  {
    label: "Promemoria",
    html: buildReminderHtml(SAMPLE_NOME),
    height: 620,
  },
  {
    label: "Notifica admin (nuova RSVP)",
    html: `<!DOCTYPE html><html><body style="margin:0;padding:24px;background:#F1ECE0;font-family:-apple-system,sans-serif;">${adminNotificationFragment}</body></html>`,
    height: 280,
  },
];

export default function EmailPreviewPage() {
  return (
    <main className="min-h-screen bg-paper text-ink px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl">Anteprima Email</h1>
          <Link
            href="/admin"
            className="text-xs text-ink-soft hover:text-accent transition-colors uppercase tracking-wide"
          >
            ← RSVP
          </Link>
        </div>

        <p className="text-sm text-ink-soft mb-8">
          Rendering dal vivo dei template con dati d&rsquo;esempio — nessuna email viene inviata da qui.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {TEMPLATES.map((t) => (
            <div key={t.label} className="ticket-card rounded-2xl overflow-hidden">
              <p className="stub-label px-4 py-3 border-b border-ink/10">{t.label}</p>
              <iframe
                srcDoc={t.html}
                title={t.label}
                style={{ height: t.height }}
                className="w-full block"
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
