"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Errore di accesso");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="glass-card rounded-2xl p-8 w-full max-w-sm">
        <h1 className="font-serif text-2xl text-gold-shimmer text-center mb-1">
          Area Admin
        </h1>
        <p className="text-sm text-[#888] text-center mb-6">
          Inserisci la password per vedere le RSVP.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-lg bg-black/40 border border-[#2A2A2A] px-4 py-3 text-sm text-[#F5F0E8] placeholder:text-[#666] focus:outline-none focus:border-gold/50"
          />

          {error && (
            <p className="text-sm text-red-400 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full rounded-lg bg-gold text-black font-semibold py-3 text-sm tracking-wide hover:bg-gold-light transition-colors disabled:opacity-40"
          >
            {loading ? "Verifica..." : "Entra"}
          </button>
        </form>
      </div>
    </main>
  );
}
