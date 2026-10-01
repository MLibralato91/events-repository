import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { insertRsvp } from "@/lib/supabase";
import { sendConfirmEmail, sendAdminNotification } from "@/lib/resend";

const schema = z.object({
  nome: z.string().min(2),
  cognome: z.string().min(2),
  email: z.string().email(),
  partecipa: z.enum(["si", "no"]),
  accompagnato: z.enum(["si", "no"]).optional(),
  nome_accompagnatore: z.string().optional(),
  note: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dati non validi", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { nome, cognome, email, partecipa, accompagnato, nome_accompagnatore, note } = parsed.data;

    const participaBoolean = partecipa === "si";
    const accompagnatoBoolean = accompagnato === "si";

    // 1. Salva su Supabase
    await insertRsvp({
      nome,
      cognome,
      email,
      partecipa: participaBoolean,
      accompagnato: accompagnatoBoolean,
      nome_accompagnatore: accompagnatoBoolean ? (nome_accompagnatore ?? null) : null,
      note: note ?? null,
    });

    // 2. Email di conferma all'ospite + notifica admin — attese prima di
    // rispondere: su Vercel una promise non awaited può essere interrotta a
    // metà se la funzione serverless viene congelata subito dopo la risposta,
    // causando invii falliti in modo silenzioso e intermittente.
    const [confirmResult, adminResult] = await Promise.allSettled([
      sendConfirmEmail({
        nome,
        cognome,
        email,
        partecipa: participaBoolean,
        accompagnato: accompagnatoBoolean,
        nome_accompagnatore,
      }),
      sendAdminNotification({
        nome,
        cognome,
        email,
        partecipa: participaBoolean,
        accompagnato: accompagnatoBoolean,
        nome_accompagnatore,
        note,
      }),
    ]);

    if (confirmResult.status === "rejected") {
      console.error("[RSVP] Invio email conferma fallito:", confirmResult.reason);
    }
    if (adminResult.status === "rejected") {
      console.error("[RSVP] Invio notifica admin fallito:", adminResult.reason);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[RSVP] Errore:", err);
    return NextResponse.json(
      { error: "Errore interno del server. Riprova tra qualche secondo." },
      { status: 500 }
    );
  }
}
