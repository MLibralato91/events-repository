import RsvpForm from "@/components/RsvpForm";
import EventCalendar from "@/components/EventCalendar";

// ─── Dati evento — modifica qui ────────────────────────────────────────────
const EVENT = {
  name: "Marco",
  age: 30,
  date: new Date(2025, 10, 15), // 15 Novembre 2025 — mese 0-indicizzato
  time: "20:00",
  venue: "Nome del Locale",
  address: "Via Esempio 1, Milano",
  deadline: "31 ottobre",
  coverCharge: null as string | null, // es. "€30 a persona" oppure null
  dressCode: "Smart casual",
  contactEmail: "tua@email.it",
};

const dateLabel = EVENT.date.toLocaleDateString("it-IT", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

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
    <div className={`ticket-card rounded-[28px] p-6 sm:p-8 ${className}`} style={style}>
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

function StubField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="stub-label mb-1">{label}</p>
      <p className="text-sm text-ink font-medium">{value}</p>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-paper text-ink flex flex-col items-center py-14 px-4">
      <div className="w-full max-w-lg">

        {/* ── Ticket header: invito ── */}
        <TicketCard className="mb-6 animate-fade-in">
          <div className="flex justify-center mb-4">
            <span className="text-2xl rotate-45 inline-block text-accent">✈</span>
          </div>

          <p className="stub-label text-center mb-3">Biglietto d&rsquo;invito</p>

          <h1 className="font-serif text-5xl sm:text-6xl text-center leading-tight">
            {EVENT.age} Anni
          </h1>
          <h2 className="font-serif italic text-2xl sm:text-3xl text-center text-ink-soft mt-1">
            di {EVENT.name}
          </h2>

          <TicketDivider />

          <div className="grid grid-cols-2 gap-y-4">
            <StubField label="Data" value={dateLabel} />
            <StubField label="Ora" value={EVENT.time} />
            <StubField label="Luogo" value={EVENT.venue} />
            <StubField label="Dress code" value={EVENT.dressCode} />
          </div>
        </TicketCard>

        {/* ── Messaggio ── */}
        <TicketCard className="mb-6 bg-ink text-paper-card animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <p className="stub-label text-paper-card/60 text-center mb-3">
            Cari amici e parenti
          </p>
          <p className="font-serif italic text-lg text-center leading-relaxed">
            Compio {EVENT.age} anni e voglio festeggiare insieme a voi.
            Sarebbe un onore avervi al mio fianco in questo giorno speciale.
          </p>
        </TicketCard>

        {/* ── Calendario ── */}
        <TicketCard className="mb-6 animate-fade-up" style={{ animationDelay: "0.15s" }}>
          <p className="stub-label text-center mb-4">Segna la data</p>
          <EventCalendar date={EVENT.date} />
        </TicketCard>

        {/* ── Luogo ── */}
        <TicketCard className="mb-6 animate-fade-up" style={{ animationDelay: "0.2s" }}>
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

        {/* ── Form RSVP ── */}
        <TicketCard className="animate-fade-up" style={{ animationDelay: "0.25s" }}>
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
          </a>
        </footer>

      </div>
    </main>
  );
}
