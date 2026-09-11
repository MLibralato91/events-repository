import { createClient } from "@supabase/supabase-js";

// Client server-only con service role key: bypassa RLS, non importare mai in un client component.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Supabase admin env vars mancanti: NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY"
  );
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
  global: {
    // Next.js applica la Data Cache anche ai fetch di librerie esterne come
    // supabase-js: senza questo, "/admin" può servire RSVP stale nonostante
    // `dynamic = "force-dynamic"` sulla pagina.
    fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
  },
});
