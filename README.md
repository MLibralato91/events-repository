# RSVP Party 🥂

Pagina RSVP per eventi — Next.js 14 + Supabase + Resend.

## Setup in 4 passi

### 1. Installa le dipendenze
```bash
npm install
```

### 2. Configura le variabili d'ambiente
```bash
cp .env.local.example .env.local
# Poi apri .env.local e inserisci i valori reali
```

### 3. Crea la tabella su Supabase
1. Apri [app.supabase.com](https://app.supabase.com)
2. Vai in **SQL Editor**
3. Incolla ed esegui il contenuto di `supabase-schema.sql`

### 4. Verifica il dominio su Resend
1. Apri [resend.com](https://resend.com) → **Domains**
2. Aggiungi il tuo dominio e configura i record DNS su Netsons
3. Aggiorna il campo `from` in `lib/resend.ts` con il tuo dominio

---

## Personalizzazione evento

Modifica le variabili `EVENT` in:
- `app/page.tsx` — nome, data, luogo, dress code
- `lib/resend.ts` — stesse info per le email + indirizzo `from`

## Deploy su Vercel

1. Pusha su GitHub (`https://github.com/MLibralato91/events-repository.git`)
2. Importa il repo su [vercel.com](https://vercel.com)
3. In **Environment Variables** aggiungi le stesse chiavi del `.env.local`
4. Deploy 🚀

---

## Struttura progetto

```
├── app/
│   ├── page.tsx              # Home: hero + form RSVP
│   ├── conferma/page.tsx     # Pagina post-submit
│   ├── api/rsvp/route.ts    # API: salva + invia email
│   └── globals.css
├── components/
│   └── RsvpForm.tsx          # Form con validazione
├── lib/
│   ├── supabase.ts           # Client + funzione insert
│   └── resend.ts             # Template email + invio
└── supabase-schema.sql       # Schema DB da eseguire su Supabase
```

## Vedere le RSVP

Dal pannello Supabase → **Table Editor** → `rsvps` trovi tutti i dati in tabella.
Puoi anche esportarli in CSV direttamente da lì.
