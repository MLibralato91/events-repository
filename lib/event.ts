// ─── Dati evento — unica fonte, usata da app/page.tsx, lib/resend.ts e
// app/api/calendar/route.ts ──────────────────────────────────────────────

export const EVENT = {
  name: "Matteo",
  age: 30,
  date: new Date(2026, 9, 23), // 23 Ottobre 2026 — mese 0-indicizzato
  time: "20:00",
  durationHours: 4, // usato per l'evento esportato nel calendario
  timeZone: "Europe/Rome",
  venue: "Nome del Locale",
  address: "Via Esempio 1, Milano",
  deadline: "16 ottobre",
  coverCharge: null as string | null, // es. "€30 a persona" oppure null
  dressCode: "Smart casual",
  contactEmail: "tua@email.it",
  heroImage: "/hero.jpg",
  musicSrc: "/music.mp3",
  resendFrom: "Festa di Matteo <noreply@mail.eventogo.it>",
};

export function eventDateLabel() {
  return EVENT.date.toLocaleDateString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Converte l'orario "locale" dell'evento (fuso EVENT.timeZone) in un istante
// UTC corretto, indipendentemente dal fuso orario del server che esegue il
// codice (es. Vercel gira in UTC, non in Europe/Rome).
export function zonedTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string
): Date {
  const utcGuess = new Date(Date.UTC(year, month, day, hour, minute));
  const asIfUtc = new Date(utcGuess.toLocaleString("en-US", { timeZone: "UTC" }));
  const asIfZoned = new Date(utcGuess.toLocaleString("en-US", { timeZone }));
  const offsetMs = asIfUtc.getTime() - asIfZoned.getTime();
  return new Date(utcGuess.getTime() + offsetMs);
}

export function eventStartUtc(): Date {
  const [hour, minute] = EVENT.time.split(":").map(Number);
  return zonedTimeToUtc(
    EVENT.date.getFullYear(),
    EVENT.date.getMonth(),
    EVENT.date.getDate(),
    hour,
    minute,
    EVENT.timeZone
  );
}

export function eventEndUtc(): Date {
  return new Date(eventStartUtc().getTime() + EVENT.durationHours * 60 * 60 * 1000);
}

export function formatIcsUtc(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export function mapsUrl(): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${EVENT.venue}, ${EVENT.address}`
  )}`;
}

export function googleCalendarUrl(): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${EVENT.age} anni di ${EVENT.name}`,
    dates: `${formatIcsUtc(eventStartUtc())}/${formatIcsUtc(eventEndUtc())}`,
    details: "Ti aspettiamo per festeggiare insieme!",
    location: `${EVENT.venue}, ${EVENT.address}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
