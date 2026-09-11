import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

// ─── Dati evento (mantieni in sync con app/page.tsx) ──────────────────────
const EVENT = {
  name: "Matteo",
  age: 30,
  date: "Venerdì 23 Ottobre 2026",
  time: "20:00",
  venue: "Nome del Locale",
  address: "Via Esempio 1, Milano",
  from: "Festa di Matteo <noreply@tuodominio.it>", // Modifica con il tuo dominio verificato su Resend
};

// ─── Template email conferma ───────────────────────────────────────────────
function buildConfirmHtml(nome: string, partecipa: boolean, accompagnato: boolean, nomeAccomp?: string | null) {
  const gold = "#C9A84C";
  const dark = "#0A0A0A";

  const bodyContent = partecipa
    ? `
      <p style="color:#C5B99A;font-size:16px;line-height:1.7;margin:0 0 24px;">
        Ottimo! La tua presenza alla festa di <strong style="color:${gold}">${EVENT.age} anni di ${EVENT.name}</strong> è confermata.
        ${accompagnato && nomeAccomp ? `Hai segnalato che verrai con <strong style="color:${gold}">${nomeAccomp}</strong>.` : ""}
      </p>
      <div style="background:#141414;border:1px solid rgba(201,168,76,0.2);border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="color:${gold};font-size:11px;letter-spacing:0.3em;text-transform:uppercase;margin:0 0 12px;font-weight:600;">Dettagli</p>
        <p style="color:#C5B99A;font-size:14px;margin:6px 0;">📅 ${EVENT.date} alle ${EVENT.time}</p>
        <p style="color:#C5B99A;font-size:14px;margin:6px 0;">📍 ${EVENT.venue}</p>
        <p style="color:#888;font-size:13px;margin:6px 0;">${EVENT.address}</p>
      </div>
      <p style="color:#666;font-size:13px;">Ti invieremo un promemoria qualche giorno prima. A presto!</p>
    `
    : `
      <p style="color:#C5B99A;font-size:16px;line-height:1.7;margin:0 0 24px;">
        Ci dispiace che non potrai esserci per i <strong style="color:${gold}">${EVENT.age} anni di ${EVENT.name}</strong>.
        Abbiamo registrato la tua risposta. Ci vediamo alla prossima occasione!
      </p>
    `;

  return `
    <!DOCTYPE html>
    <html lang="it">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#000;padding:40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:${dark};border:1px solid rgba(201,168,76,0.15);border-radius:16px;overflow:hidden;">

              <!-- Header -->
              <tr>
                <td style="padding:40px 40px 32px;text-align:center;border-bottom:1px solid rgba(201,168,76,0.1);">
                  <p style="color:${gold};font-size:11px;letter-spacing:0.4em;text-transform:uppercase;margin:0 0 12px;font-weight:600;">
                    ${partecipa ? "Presenza Confermata ✓" : "Risposta Ricevuta"}
                  </p>
                  <h1 style="color:#F5F0E8;font-size:32px;font-weight:700;margin:0;font-family:Georgia,serif;">
                    Ciao, ${nome}!
                  </h1>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:32px 40px;">
                  ${bodyContent}
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding:24px 40px;border-top:1px solid rgba(201,168,76,0.1);text-align:center;">
                  <p style="color:#444;font-size:12px;margin:0;">
                    Email automatica · Non rispondere a questo messaggio
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

// ─── Invio email di conferma all'ospite ───────────────────────────────────
export async function sendConfirmEmail({
  nome,
  cognome,
  email,
  partecipa,
  accompagnato,
  nome_accompagnatore,
}: {
  nome: string;
  cognome: string;
  email: string;
  partecipa: boolean;
  accompagnato: boolean;
  nome_accompagnatore?: string | null;
}) {
  const subject = partecipa
    ? `🥂 Ci vediamo alla festa, ${nome}!`
    : `Risposta ricevuta — ${EVENT.age} anni di ${EVENT.name}`;

  await resend.emails.send({
    from: EVENT.from,
    to: [email],
    subject,
    html: buildConfirmHtml(nome, partecipa, accompagnato, nome_accompagnatore),
  });
}

// ─── Notifica all'admin ────────────────────────────────────────────────────
export async function sendAdminNotification({
  nome,
  cognome,
  email,
  partecipa,
  accompagnato,
  nome_accompagnatore,
  note,
}: {
  nome: string;
  cognome: string;
  email: string;
  partecipa: boolean;
  accompagnato: boolean;
  nome_accompagnatore?: string | null;
  note?: string | null;
}) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return; // Skip se non configurato

  const status = partecipa ? "✅ PARTECIPA" : "❌ NON PARTECIPA";

  await resend.emails.send({
    from: EVENT.from,
    to: [adminEmail],
    subject: `[RSVP] ${nome} ${cognome} — ${status}`,
    html: `
      <table style="font-family:monospace;font-size:14px;color:#ccc;background:#111;padding:24px;border-radius:8px;width:100%;max-width:500px;">
        <tr><td style="color:#C9A84C;padding-bottom:16px;font-size:16px;">Nuova RSVP ricevuta</td></tr>
        <tr><td><strong>Nome:</strong> ${nome} ${cognome}</td></tr>
        <tr><td><strong>Email:</strong> ${email}</td></tr>
        <tr><td><strong>Partecipa:</strong> ${partecipa ? "Sì" : "No"}</td></tr>
        ${partecipa ? `
          <tr><td><strong>Accompagnato:</strong> ${accompagnato ? "Sì" : "No"}</td></tr>
          ${nome_accompagnatore ? `<tr><td><strong>Accompagnatore:</strong> ${nome_accompagnatore}</td></tr>` : ""}
          ${note ? `<tr><td><strong>Note:</strong> ${note}</td></tr>` : ""}
        ` : ""}
      </table>
    `,
  });
}
