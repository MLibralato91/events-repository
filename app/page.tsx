import RsvpForm from "@/components/RsvpForm";
import EventCalendar from "@/components/EventCalendar";
import HeroPhoto from "@/components/HeroPhoto";
import MusicPlayer from "@/components/MusicPlayer";
import Countdown from "@/components/Countdown";

// ─── Dati evento — modifica qui ────────────────────────────────────────────
const EVENT = {
  name: "Matteo",
  age: 30,
  date: new Date(2026, 9, 23), // 23 Ottobre 2026 — mese 0-indicizzato
  time: "20:00",
  venue: "Nome del Locale",
  address: "Via Esempio 1, Milano",
  deadline: "16 ottobre",
  coverCharge: null as string | null, // es. "€30 a persona" oppure null
  dressCode: "Smart casual",
  contactEmail: "tua@email.it",
  heroImage: "/hero.jpg",
  musicSrc: "/music.mp3",
};

const dateLabel = EVENT.date.toLocaleDateString("it-IT", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const [eventHour, eventMinute] = EVENT.time.split(":").map(Number);
const eventDateTime = new Date(EVENT.date);
eventDateTime.setHours(eventHour, eventMinute, 0, 0);

// ─── Card in stile boarding pass, con "fori" tratteggiati ─────────────────
function TicketCard({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`ticket-card rounded-[28px] ${className}`} style={style}>
      {children}
    </div>
  );
}

function TicketDivider() {
  return (
    <div className="ticket-divider">
      <span className="ticket-notch" />
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-paper text-ink flex flex-col items-center py-14 px-4">
      <div className="w-full max-w-lg">

        {/* ── Hero: foto del festeggiato ── */}
        <TicketCard className="mb-6 overflow-hidden animate-fade-in">
          <HeroPhoto src={EVENT.heroImage} alt={`${EVENT.name} — festeggiato`} />

          <div className="p-6 sm:p-8">
            <p className="stub-label text-center mb-3">Sei invitato</p>
            <h1 className="font-serif text-5xl sm:text-6xl text-center leading-tight">
              {EVENT.age} Anni
            </h1>
            <h2 className="font-serif italic text-2xl sm:text-3xl text-center text-ink-soft mt-1 mb-4">
              di {EVENT.name}
            </h2>
            <p className="text-sm text-ink-soft text-center">
              {dateLabel} · ore {EVENT.time}
            </p>
          </div>
        </TicketCard>

        {/* ── Countdown ── */}
        <TicketCard className="mb-6 p-6 sm:p-8 animate-fade-up" style={{ animationDelay: "0.05s" }}>
          <p className="stub-label text-center mb-4">Manca ancora</p>
          <Countdown target={eventDateTime} />
        </TicketCard>

        {/* ── Calendario ── */}
        <TicketCard className="mb-6 p-6 sm:p-8 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <p className="stub-label text-center mb-4">Segna la data</p>
          <EventCalendar date={EVENT.date} />
        </TicketCard>

        {/* ── Player musicale ── */}
        <TicketCard className="mb-6 p-6 sm:p-8 animate-fade-up" style={{ animationDelay: "0.12s" }}>
          <p className="stub-label text-center mb-4">Colonna sonora</p>
          <div className="flex justify-center">
            <MusicPlayer src={EVENT.musicSrc} />
          </div>
        </TicketCard>

        {/* ── Luogo ── */}
        <TicketCard className="mb-6 p-6 sm:p-8 animate-fade-up" style={{ animationDelay: "0.15s" }}>
          <p className="stub-label text-center mb-2">Dove</p>
          <p className="font-serif text-xl text-center mb-1">{EVENT.venue}</p>
          <p className="text-sm text-ink-soft text-center">{EVENT.address}</p>

          {EVENT.coverCharge && (
            <>
              <TicketDivider />
              <p className="text-sm text-center text-ink-soft">
                Quota di partecipazione: <span className="text-ink font-medium">{EVENT.coverCharge}</span>
              </p>
            </>
          )}

          <TicketDivider />

          <p className="stub-label text-center">
            Conferma entro il <span className="text-ink">{EVENT.deadline}</span>
          </p>
        </TicketCard>

        {/* ── Outfit ── */}
        <TicketCard className="mb-6 p-6 sm:p-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <p className="stub-label text-center mb-2">Dress code</p>
          <p className="font-serif text-xl text-center">{EVENT.dressCode}</p>
        </TicketCard>

        {/* ── Form RSVP ── */}
        <TicketCard className="p-6 sm:p-8 animate-fade-up" style={{ animationDelay: "0.25s" }}>
          <p className="stub-label text-center mb-1">Conferma la presenza</p>
          <p className="text-sm text-ink-soft text-center mb-6">
            Compila il form qui sotto per farci sapere se ci sarai.
          </p>
          <RsvpForm />
        </TicketCard>

        {/* ── Footer ── */}
        <footer className="text-center mt-8 text-xs text-ink-soft/70">
          Per qualsiasi info scrivi a{" "}
          <a
            href={`mailto:${EVENT.contactEmail}`}
            className="text-ink underline underline-offset-2 hover:text-accent transition-colors"
          >
            {EVENT.contactEmail}
          </a>{" "}
          {/* Accesso admin nascosto: stesso colore dello sfondo, invisibile a vista */}
          <a href="/admin" className="text-paper hover:text-paper" aria-label="Area riservata">
            ·
          </a>
        </footer>

      </div>
    </main>
  );
}
