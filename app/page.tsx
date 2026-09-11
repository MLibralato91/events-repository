import RsvpForm from "@/components/RsvpForm";

// ─── Dati evento — modifica qui ────────────────────────────────────────────
const EVENT = {
  name: "Marco",           // Nome del festeggiato
  age: 30,
  date: "Sabato 15 Novembre 2025",
  time: "20:00",
  venue: "Nome del Locale",
  address: "Via Esempio 1, Milano",
  deadline: "31 ottobre",  // Scadenza RSVP
  coverCharge: null,       // es. "€30 a persona" oppure null
  dressCode: "Smart casual",
};

// ─── Sfondo decorativo ─────────────────────────────────────────────────────
function Orbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden>
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, #C9A84C 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-8"
        style={{
          background: "radial-gradient(circle, #C9A84C 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

// ─── Divisore dorato ───────────────────────────────────────────────────────
function GoldDivider() {
  return (
    <div className="flex items-center gap-3 my-6">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/40" />
      <span className="text-gold text-xs tracking-[0.3em] uppercase">✦</span>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold/40" />
    </div>
  );
}

// ─── Info card evento ──────────────────────────────────────────────────────
function InfoRow({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-start gap-3 text-sm text-[#C5B99A]">
      <span className="text-base mt-0.5 shrink-0">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

// ─── Pagina principale ─────────────────────────────────────────────────────
export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-start py-12 px-4">
      <Orbs />

      <div className="relative z-10 w-full max-w-lg">

        {/* Header */}
        <header className="text-center mb-8 animate-fade-in">
          <p className="text-gold text-xs tracking-[0.4em] uppercase mb-4 font-medium">
            Sei Invitato
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl font-bold mb-2 text-gold-shimmer">
            {EVENT.age} Anni
          </h1>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#F5F0E8] italic">
            di {EVENT.name}
          </h2>
        </header>

        {/* Card info evento */}
        <div className="glass-card rounded-2xl p-6 mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <h3 className="text-xs font-semibold tracking-[0.3em] uppercase text-gold mb-4">
            Dettagli Evento
          </h3>
          <div className="space-y-3">
            <InfoRow icon="📅" text={`${EVENT.date} alle ${EVENT.time}`} />
            <InfoRow icon="📍" text={`${EVENT.venue} — ${EVENT.address}`} />
            {EVENT.dressCode && (
              <InfoRow icon="👔" text={`Dress code: ${EVENT.dressCode}`} />
            )}
            {EVENT.coverCharge && (
              <InfoRow icon="💳" text={`Quota: ${EVENT.coverCharge}`} />
            )}
          </div>

          <GoldDivider />

          <p className="text-xs text-[#666] text-center">
            Conferma entro il <span className="text-gold font-medium">{EVENT.deadline}</span>
          </p>
        </div>

        {/* Card form RSVP */}
        <div className="glass-card rounded-2xl p-6 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <h3 className="text-xs font-semibold tracking-[0.3em] uppercase text-gold mb-1">
            Conferma la Presenza
          </h3>
          <p className="text-sm text-[#888] mb-6">
            Compila il form qui sotto per confermare la tua partecipazione.
          </p>
          <RsvpForm />
        </div>

        {/* Footer */}
        <footer className="text-center mt-8 text-xs text-[#444]">
          Per qualsiasi info scrivi a{" "}
          <a
            href={`mailto:tua@email.it`}
            className="text-gold/60 hover:text-gold transition-colors"
          >
            tua@email.it
          </a>
        </footer>

      </div>
    </main>
  );
}
