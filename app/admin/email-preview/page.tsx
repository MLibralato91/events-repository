import Link from "next/link";
import {
  buildConfirmHtml,
  buildReminderHtml,
  buildAdminNotificationHtml,
} from "@/lib/resend";

// ─── Dati d'esempio — solo per l'anteprima, non toccano email reali ───────
const SAMPLE_NOME = "Giorgia";

function wrapFragment(html: string) {
  return `<!DOCTYPE html><html><body style="margin:0;padding:24px;background:#F1ECE0;font-family:-apple-system,sans-serif;">${html}</body></html>`;
}

const TEMPLATES = [
  {
    label: "Conferma — Sì",
    description: "Inviata automaticamente all'ospite subito dopo che conferma la presenza.",
    html: buildConfirmHtml(SAMPLE_NOME, true, true, "Marco Rossi"),
    height: 780,
  },
  {
    label: "Conferma — No",
    description: "Inviata automaticamente quando l'ospite risponde che non può venire.",
    html: buildConfirmHtml(SAMPLE_NOME, false, false, null),
    height: 460,
  },
  {
    label: "Promemoria",
    description: "Inviata manualmente da te dal bottone \"Invia promemoria\" nella dashboard.",
    html: buildReminderHtml(SAMPLE_NOME),
    height: 780,
  },
  {
    label: "Notifica admin — partecipa",
    description: "Arriva a te ogni volta che qualcuno risponde Sì, con i dettagli della RSVP.",
    html: wrapFragment(
      buildAdminNotificationHtml({
        nome: SAMPLE_NOME,
        cognome: "Molinari",
        email: "giorgia@example.it",
        partecipa: true,
        accompagnato: true,
        nome_accompagnatore: "Marco Rossi",
        note: "Sono intollerante al lattosio",
      })
    ),
    height: 300,
  },
  {
    label: "Notifica admin — non partecipa",
    description: "Arriva a te ogni volta che qualcuno risponde No — versione senza i campi non pertinenti.",
    html: wrapFragment(
      buildAdminNotificationHtml({
        nome: SAMPLE_NOME,
        cognome: "Molinari",
        email: "giorgia@example.it",
        partecipa: false,
        accompagnato: false,
        nome_accompagnatore: null,
        note: null,
      })
    ),
    height: 220,
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

        <p className="text-sm text-ink-soft mb-10">
          Rendering dal vivo dei template con dati d&rsquo;esempio — nessuna email viene inviata da qui.
        </p>

        <div className="space-y-12">
          {TEMPLATES.map((t) => (
            <div key={t.label}>
              <p className="stub-label mb-1">{t.label}</p>
              <p className="text-sm text-ink-soft mb-3">{t.description}</p>
              <iframe
                srcDoc={t.html}
                title={t.label}
                style={{ height: t.height }}
                className="w-full block rounded-xl border border-ink/10"
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
