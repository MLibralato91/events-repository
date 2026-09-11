import Link from "next/link";

function Confetti() {
  const emojis = ["🥂", "🎉", "✨", "🎊", "🌟", "🍾"];
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden>
      {Array.from({ length: 12 }).map((_, i) => (
        <span
          key={i}
          className="absolute text-2xl animate-bounce"
          style={{
            left: `${(i * 8.5) % 100}%`,
            top: `${10 + (i * 13) % 70}%`,
            animationDelay: `${(i * 0.3) % 1.5}s`,
            animationDuration: `${1.5 + (i * 0.2) % 1}s`,
            opacity: 0.15,
          }}
        >
          {emojis[i % emojis.length]}
        </span>
      ))}
    </div>
  );
}

export default function ConfermaPage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 py-12">
      <Confetti />

      <div className="relative z-10 w-full max-w-md text-center">

        {/* Icona */}
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8"
          style={{
            background: "radial-gradient(circle, rgba(201,168,76,0.2) 0%, rgba(201,168,76,0.05) 70%)",
            border: "1px solid rgba(201,168,76,0.3)",
          }}
        >
          <span className="text-5xl">🥂</span>
        </div>

        {/* Titolo */}
        <p className="text-gold text-xs tracking-[0.4em] uppercase mb-3">
          Risposta Registrata
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gold-shimmer mb-4">
          Grazie!
        </h1>
        <p className="text-[#C5B99A] text-lg font-serif italic mb-2">
          Non vediamo l&rsquo;ora di festeggiare insieme.
        </p>

        {/* Card info */}
        <div
          className="glass-card rounded-2xl p-6 mt-8 mb-8 text-left space-y-3"
        >
          <p className="text-sm text-[#888] text-center">
            Hai ricevuto un&rsquo;email di conferma con tutti i dettagli.
            Controlla anche lo spam se non la trovi.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <div className="flex-1 h-px bg-[#2A2A2A]" />
            <span className="text-[#444] text-xs">✦</span>
            <div className="flex-1 h-px bg-[#2A2A2A]" />
          </div>

          <p className="text-xs text-[#555] text-center">
            Ti invieremo un promemoria qualche giorno prima dell&rsquo;evento.
          </p>
        </div>

        {/* Bottone torna */}
        <Link
          href="/"
          className="inline-block text-sm text-gold/60 hover:text-gold transition-colors underline underline-offset-4"
        >
          ← Torna alla pagina dell&rsquo;evento
        </Link>
      </div>
    </main>
  );
}
