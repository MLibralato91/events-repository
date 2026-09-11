# Recap progetto — RSVP Party (Matteo, 30 anni)

Stato al 2026-09-11. Repo: https://github.com/MLibralato91/events-repository

## Cos'è

Pagina RSVP a singola scrollata in stile "boarding pass" (navy + cream) per la festa
di 30 anni di Matteo, 23 ottobre 2026. Next.js 14 (App Router) + Supabase (DB) +
Resend (email). Dashboard admin protetta per vedere le risposte.

## Stack

- Next.js 14.2.5, React, TypeScript, Tailwind
- Supabase (Postgres + RLS) — tabella `rsvps`
- Resend — email conferma ospite + notifica admin
- react-hook-form + zod — validazione form

## Stato env (.env.local)

| Variabile | Stato |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ impostato (progetto reale) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ impostato |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ impostato |
| `RESEND_API_KEY` | ❌ placeholder — email non testate |
| `ADMIN_EMAIL` | ❌ placeholder |
| `ADMIN_PASSWORD` | ⚠️ ancora `cambia-questa-password` — **cambiala prima di condividere il link**, l'accesso admin è raggiungibile (vedi sotto) |

`.env.local` non è versionato (gitignore) — su nuovo dispositivo va ricreato da
`.env.local.example` e riempito con gli stessi valori reali.

## Cosa manca (asset)

- `public/hero.jpg` — foto di Matteo. Finché manca, la hero mostra un placeholder testuale (nessun errore).
- `public/music.mp3` — musica di sottofondo. Finché manca, il bottone play resta disabilitato (nessun errore).

Entrambi vanno solo copiati nella cartella `public/`, zero codice da toccare.

## Cosa è stato testato e funziona

- Flusso RSVP completo: form → insert Supabase → riga visibile in `/admin`
- Login admin (password) → sessione via cookie firmato → dashboard con statistiche
- Countdown, calendario con giorno evidenziato, bottoni Google Calendar / .ics / Google Maps
- Accesso da dispositivo mobile sulla stessa rete WiFi (via IP LAN del Mac)

## Cosa NON è ancora testato

- Invio email reali (Resend key placeholder) — l'insert RSVP funziona comunque,
  l'invio email è fire-and-forget e non blocca la risposta anche se fallisce
- Deploy su Vercel (mai fatto — solo dev locale finora)

## Decisioni/bug non ovvi da ricordare

- **Dati evento centralizzati in `lib/event.ts`** — unica fonte, letta da `app/page.tsx`,
  `lib/resend.ts`, `app/api/calendar/route.ts`. Cambia lì, non altrove.
- **Fuso orario esplicito** (`EVENT.timeZone = "Europe/Rome"`): la conversione a UTC per
  countdown/calendario è fatta a mano (`zonedTimeToUtc` in `lib/event.ts`) perché il
  server (Vercel) gira in UTC — costruire `new Date(...)` senza questa conversione
  avrebbe sfasato l'orario di 1-2h in produzione.
- **`insertRsvp()` non fa `.select()` dopo l'insert**: la RETURNING implicita passa
  anche dalla RLS di SELECT (che esiste solo per `authenticated`), quindi con
  `.select()` l'insert veniva rifiutato anche con policy INSERT corretta.
- **`lib/supabase-admin.ts` forza `cache: "no-store"`** sul fetch: Next cache anche i
  fetch di librerie esterne come supabase-js, quindi senza questo la dashboard
  admin può mostrare dati stale nonostante `dynamic = "force-dynamic"`.
- **`Countdown` non calcola nulla al primo render** (mostra `--` finché non monta lato
  client): calcolare subito da `Date.now()` causa hydration mismatch tra server e
  client se passa tempo tra i due (visibile su rete mobile/LAN lenta, invisibile su
  localhost).
- **`.ticket-divider` usa `padding`, non `margin`**, per lo spazio verticale: un box
  vuoto con soli figli `position:absolute` collassa margin top/bottom in modo
  asimmetrico con i vicini.
- **Accesso admin nascosto**: punto `·` nel footer della home, stesso colore dello
  sfondo (invisibile), area di tocco 16×16px, link a `/admin`.

## Come riprendere su un altro dispositivo

```bash
git clone https://github.com/MLibralato91/events-repository.git
cd events-repository
npm install
cp .env.local.example .env.local
# riempire .env.local con le chiavi reali (vedi tabella sopra)
npm run dev
```

Per test da mobile sulla stessa WiFi: `http://<IP-LAN-del-Mac>:3000` (l'IP si trova con
`ipconfig getifaddr en0` su Mac, cambia se il Mac si riconnette alla rete).
