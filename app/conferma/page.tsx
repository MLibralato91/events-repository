import Link from "next/link";

export default function ConfermaPage({
  searchParams,
}: {
  searchParams: { partecipa?: string };
}) {
  const partecipa = searchParams.partecipa !== "no";

  return (
    <main className="min-h-screen bg-paper text-ink flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">

        <div className="ticket-card rounded-[28px] p-8">
          <div className="flex justify-center mb-4">
            <span className="text-2xl inline-block text-accent">
              {partecipa ? <span className="rotate-45 inline-block">✈</span> : "💌"}
            </span>
          </div>

          <p className="stub-label mb-3">Risposta registrata</p>
          <h1 className="font-serif text-4xl sm:text-5xl mb-4">
            {partecipa ? "Grazie!" : "Peccato!"}
          </h1>
          <p className="font-serif italic text-lg text-ink-soft mb-2">
            {partecipa
              ? "Non vediamo l’ora di festeggiare insieme."
              : "Ci dispiace che non ci sarai, ma capiamo."}
          </p>

          <div className="ticket-divider">
            <span className="ticket-notch" />
          </div>

          <p className="text-sm text-ink-soft">
            Hai ricevuto un&rsquo;email di conferma della tua risposta.
            Controlla anche lo spam se non la trovi.
          </p>
          {partecipa && (
            <p className="stub-label mt-4">
              Ti invieremo un promemoria qualche giorno prima dell&rsquo;evento.
            </p>
          )}
        </div>

        <Link
          href="/"
          className="inline-block mt-8 text-sm text-ink-soft hover:text-accent transition-colors underline underline-offset-4"
        >
          ← Torna alla pagina dell&rsquo;evento
        </Link>
      </div>
    </main>
  );
}
