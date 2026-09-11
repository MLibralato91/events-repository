import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase env vars mancanti: NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Tipi ──────────────────────────────────────────────────────────────────

export type Rsvp = {
  id?: string;
  created_at?: string;
  nome: string;
  cognome: string;
  email: string;
  partecipa: boolean;
  accompagnato: boolean;
  nome_accompagnatore: string | null;
  note: string | null;
};

export async function insertRsvp(rsvp: Omit<Rsvp, "id" | "created_at">) {
  const { data, error } = await supabase
    .from("rsvps")
    .insert([rsvp])
    .select()
    .single();

  if (error) throw error;
  return data as Rsvp;
}
