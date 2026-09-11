import RsvpForm from "@/components/RsvpForm";
import EventCalendar from "@/components/EventCalendar";
import HeroPhoto from "@/components/HeroPhoto";
import MusicPlayer from "@/components/MusicPlayer";
import Countdown from "@/components/Countdown";
import {
  EVENT,
  eventDateLabel,
  eventStartUtc,
  mapsUrl,
  googleCalendarUrl,
} from "@/lib/event";

const dateLabel = eventDateLabel();
const eventDateTime = eventStartUtc();

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

          <TicketDivider />

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={googleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-3 px-4 rounded-lg border border-ink/15 text-sm font-medium text-ink-soft hover:border-ink/40 hover:text-ink transition-colors"
            >
              📅 Google Calendar
            </a>
            <a
              href="/api/calendar"
              className="flex-1 text-center py-3 px-4 rounded-lg border border-ink/15 text-sm font-medium text-ink-soft hover:border-ink/40 hover:text-ink transition-colors"
            >
              📥 Apple / Outlook (.ics)
            </a>
          </div>
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
          <p className="text-sm text-ink-soft text-center mb-4">{EVENT.address}</p>

          <div className="flex justify-center">
            <a
              href={mapsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-center py-3 px-6 rounded-lg border border-ink/15 text-sm font-medium text-ink-soft hover:border-ink/40 hover:text-ink transition-colors"
            >
              🧭 Come arrivare
            </a>
          </div>

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
          {/* Accesso admin nascosto: stesso colore dello sfondo, invisibile a vista.
              min 16px per un'area di tocco decente pur restando invisibile. */}
          <a
            href="/admin"
            className="text-paper hover:text-paper inline-flex items-center justify-center align-middle"
            style={{ width: 16, height: 16, fontSize: 16 }}
            aria-label="Area riservata"
          >
            ·
          </a>
        </footer>

      </div>
    </main>
  );
}
