import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendReminderEmail } from "@/lib/resend";

// Non coperto dal middleware (che protegge solo /admin/:path*), quindi
// l'autenticazione va rifatta qui allo stesso modo.
async function isAuthorized(req: NextRequest) {
  const secret = process.env.ADMIN_PASSWORD;
  const token = req.cookies.get("admin_session")?.value;
  return !!secret && (await verifySessionToken(token, secret));
}

export async function POST(req: NextRequest) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("rsvps")
    .select("nome, email")
    .eq("partecipa", true);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Più RSVP possono condividere la stessa email (es. risposte doppie): una
  // sola email di promemoria per indirizzo, non una per riga.
  const uniqueByEmail = new Map<string, { nome: string; email: string }>();
  for (const r of data ?? []) {
    uniqueByEmail.set(r.email.trim().toLowerCase(), r);
  }

  const results = await Promise.allSettled(
    [...uniqueByEmail.values()].map((r) => sendReminderEmail({ nome: r.nome, email: r.email }))
  );

  const sent = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.length - sent;

  return NextResponse.json({ total: results.length, sent, failed });
}
