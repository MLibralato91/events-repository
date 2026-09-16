import { Resend } from "resend";
import { EVENT as EVENT_BASE, eventDateLabel } from "./event";

const resend = new Resend(process.env.RESEND_API_KEY!);

const EVENT = {
  ...EVENT_BASE,
  date: eventDateLabel(),
  from: EVENT_BASE.resendFrom,
};

// ─── Template email conferma — stile "boarding pass" della pagina ─────────
export function buildConfirmHtml(nome: string, partecipa: boolean, accompagnato: boolean, nomeAccomp?: string | null) {
  const ink = "#1B2A4A";
  const inkSoft = "#33456B";
  const accent = "#B5654F";
  const paper = "#F1ECE0";
  const paperCard = "#FBF8F1";

  const bodyContent = partecipa
    ? `
      <p style="color:${inkSoft};font-size:16px;line-height:1.7;margin:0 0 24px;">
        Ottimo! La tua presenza alla festa di <strong style="color:${accent}">${EVENT.age} anni di ${EVENT.name}</strong> è confermata.
        ${accompagnato && nomeAccomp ? `Hai segnalato che verrai con <strong style="color:${accent}">${nomeAccomp}</strong>.` : ""}
      </p>
      <div style="background:${paper};border-top:2px dashed rgba(27,42,74,0.25);border-bottom:2px dashed rgba(27,42,74,0.25);border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="color:${inkSoft};font-size:11px;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 12px;font-weight:600;">Dettagli</p>
        <p style="color:${ink};font-size:14px;margin:6px 0;">📅 ${EVENT.date} alle ${EVENT.time}</p>
        <p style="color:${ink};font-size:14px;margin:6px 0;">📍 ${EVENT.venue}</p>
        <p style="color:${inkSoft};font-size:13px;margin:6px 0;">${EVENT.address}</p>
      </div>
      <p style="color:${inkSoft};font-size:13px;">Ti invieremo un promemoria qualche giorno prima. A presto!</p>
    `
    : `
      <p style="color:${inkSoft};font-size:16px;line-height:1.7;margin:0 0 24px;">
        Ci dispiace che non potrai esserci per i <strong style="color:${accent}">${EVENT.age} anni di ${EVENT.name}</strong>.
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
    <body style="margin:0;padding:0;background-color:${paper};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${paper};padding:32px 16px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:${paperCard};border:1px solid rgba(27,42,74,0.1);border-radius:16px;overflow:hidden;">

              <!-- Header -->
              <tr>
                <td style="padding:32px 28px 28px;text-align:center;border-bottom:1px solid rgba(27,42,74,0.1);">
                  <p style="color:${accent};font-size:11px;letter-spacing:0.3em;text-transform:uppercase;margin:0 0 12px;font-weight:600;">
                    ${partecipa ? "Presenza Confermata ✓" : "Risposta Ricevuta"}
                  </p>
                  <h1 style="color:${ink};font-size:32px;font-weight:700;margin:0;font-family:Georgia,serif;">
                    Ciao, ${nome}!
                  </h1>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:28px;">
                  ${bodyContent}
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding:20px 28px;border-top:1px solid rgba(27,42,74,0.1);text-align:center;">
                  <p style="color:${inkSoft};font-size:12px;margin:0;opacity:0.6;">
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

// ─── Template email promemoria — inviata manualmente dall'admin ───────────
export function buildReminderHtml(nome: string) {
  const ink = "#1B2A4A";
  const inkSoft = "#33456B";
  const accent = "#B5654F";
  const paper = "#F1ECE0";
  const paperCard = "#FBF8F1";

  return `
    <!DOCTYPE html>
    <html lang="it">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:${paper};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${paper};padding:32px 16px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:${paperCard};border:1px solid rgba(27,42,74,0.1);border-radius:16px;overflow:hidden;">

              <!-- Header -->
              <tr>
                <td style="padding:32px 28px 28px;text-align:center;border-bottom:1px solid rgba(27,42,74,0.1);">
                  <p style="color:${accent};font-size:11px;letter-spacing:0.3em;text-transform:uppercase;margin:0 0 12px;font-weight:600;">
                    Promemoria
                  </p>
                  <h1 style="color:${ink};font-size:32px;font-weight:700;margin:0;font-family:Georgia,serif;">
                    Ci siamo quasi, ${nome}!
                  </h1>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:28px;">
                  <p style="color:${inkSoft};font-size:16px;line-height:1.7;margin:0 0 24px;">
                    Manca pochissimo ai <strong style="color:${accent}">${EVENT.age} anni di ${EVENT.name}</strong> — ecco un riepilogo per non farti trovare impreparato.
                  </p>
                  <div style="background:${paper};border-top:2px dashed rgba(27,42,74,0.25);border-bottom:2px dashed rgba(27,42,74,0.25);border-radius:12px;padding:20px;margin-bottom:24px;">
                    <p style="color:${inkSoft};font-size:11px;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 12px;font-weight:600;">Dettagli</p>
                    <p style="color:${ink};font-size:14px;margin:6px 0;">📅 ${EVENT.date} alle ${EVENT.time}</p>
                    <p style="color:${ink};font-size:14px;margin:6px 0;">📍 ${EVENT.venue}</p>
                    <p style="color:${inkSoft};font-size:13px;margin:6px 0;">${EVENT.address}</p>
                    <p style="color:${ink};font-size:14px;margin:12px 0 0;">👔 ${EVENT.dressCode}</p>
                  </div>
                  <p style="color:${inkSoft};font-size:13px;">A prestissimo!</p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding:20px 28px;border-top:1px solid rgba(27,42,74,0.1);text-align:center;">
                  <p style="color:${inkSoft};font-size:12px;margin:0;opacity:0.6;">
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

// ─── Invio promemoria a un ospite ──────────────────────────────────────────
export async function sendReminderEmail({ nome, email }: { nome: string; email: string }) {
  await resend.emails.send({
    from: EVENT.from,
    to: [email],
    subject: `⏰ Ci vediamo presto — ${EVENT.age} anni di ${EVENT.name}`,
    html: buildReminderHtml(nome),
  });
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
export function buildAdminNotificationHtml({
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
  return `
    <table style="font-family:monospace;font-size:14px;color:#1B2A4A;background:#FBF8F1;border:1px solid rgba(27,42,74,0.15);padding:24px;border-radius:12px;width:100%;max-width:500px;">
      <tr><td style="color:#B5654F;padding-bottom:16px;font-size:16px;">Nuova RSVP ricevuta</td></tr>
      <tr><td><strong>Nome:</strong> ${nome} ${cognome}</td></tr>
      <tr><td><strong>Email:</strong> ${email}</td></tr>
      <tr><td><strong>Partecipa:</strong> ${partecipa ? "Sì" : "No"}</td></tr>
      ${partecipa ? `
        <tr><td><strong>Accompagnato:</strong> ${accompagnato ? "Sì" : "No"}</td></tr>
        ${nome_accompagnatore ? `<tr><td><strong>Accompagnatore:</strong> ${nome_accompagnatore}</td></tr>` : ""}
        ${note ? `<tr><td><strong>Note:</strong> ${note}</td></tr>` : ""}
      ` : ""}
    </table>
  `;
}

export async function sendAdminNotification(params: {
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

  const status = params.partecipa ? "✅ PARTECIPA" : "❌ NON PARTECIPA";

  await resend.emails.send({
    from: EVENT.from,
    to: [adminEmail],
    subject: `[RSVP] ${params.nome} ${params.cognome} — ${status}`,
    html: buildAdminNotificationHtml(params),
  });
}
