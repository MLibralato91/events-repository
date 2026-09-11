import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Rsvp } from "@/lib/supabase";
import LogoutButton from "@/components/LogoutButton";

export const dynamic = "force-dynamic";

async function getRsvps(): Promise<Rsvp[]> {
  const { data, error } = await supabaseAdmin
    .from("rsvps")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Rsvp[];
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="ticket-card rounded-2xl px-4 py-3 flex-1 min-w-[120px]">
      <p className="stub-label mb-1">{label}</p>
      <p className="text-2xl font-serif text-ink">{value}</p>
    </div>
  );
}

export default async function AdminPage() {
  const rsvps = await getRsvps();

  const partecipano = rsvps.filter((r) => r.partecipa);
  const nonPartecipano = rsvps.filter((r) => !r.partecipa);
  const accompagnatori = rsvps.filter((r) => r.accompagnato).length;
  const totalePersone = partecipano.length + accompagnatori;

  return (
    <main className="min-h-screen bg-paper text-ink px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl">RSVP Ricevute</h1>
          <LogoutButton />
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <StatCard label="Risposte totali" value={rsvps.length} />
          <StatCard label="Partecipano" value={partecipano.length} />
          <StatCard label="Non partecipano" value={nonPartecipano.length} />
          <StatCard label="Con accompagnatore" value={accompagnatori} />
          <StatCard label="Persone attese" value={totalePersone} />
        </div>

        <div className="ticket-card rounded-2xl overflow-hidden">
          {rsvps.length === 0 ? (
            <p className="text-center text-ink-soft py-12 text-sm">
              Nessuna RSVP ricevuta finora.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink/15 text-left stub-label">
                    <th className="px-4 py-3 font-medium">Nome</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Partecipa</th>
                    <th className="px-4 py-3 font-medium">Accompagnatore</th>
                    <th className="px-4 py-3 font-medium">Note</th>
                    <th className="px-4 py-3 font-medium">Ricevuta</th>
                  </tr>
                </thead>
                <tbody>
                  {rsvps.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-ink/10 last:border-0 hover:bg-ink/[0.03]"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-ink">
                        {r.nome} {r.cognome}
                      </td>
                      <td className="px-4 py-3 text-ink-soft">{r.email}</td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            r.partecipa
                              ? "text-green-700"
                              : "text-red-500/80"
                          }
                        >
                          {r.partecipa ? "Sì" : "No"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-ink-soft">
                        {r.accompagnato
                          ? r.nome_accompagnatore || "Sì (nome non indicato)"
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-ink-soft max-w-[240px] truncate">
                        {r.note || "—"}
                      </td>
                      <td className="px-4 py-3 text-ink-soft/70 whitespace-nowrap">
                        {r.created_at
                          ? new Date(r.created_at).toLocaleString("it-IT")
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
