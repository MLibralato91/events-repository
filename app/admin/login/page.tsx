"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
    <main className="min-h-screen bg-paper text-ink flex items-center justify-center px-4">
      <div className="ticket-card rounded-[28px] p-8 w-full max-w-sm">
        <div className="flex justify-center mb-4">
          <span className="text-2xl rotate-45 inline-block text-accent">✈</span>
        </div>

        <h1 className="font-serif text-2xl text-center mb-1">Area Admin</h1>
        <p className="text-sm text-ink-soft text-center mb-6">
          Inserisci la password per vedere le RSVP.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-lg bg-white border border-ink/15 px-4 py-3 text-sm text-ink placeholder:text-ink-light/50 focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink/50"
          />

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full rounded-lg bg-ink text-paper-card font-semibold py-3 text-sm tracking-wide hover:bg-ink-soft transition-colors disabled:opacity-40"
          >
            {loading ? "Verifica..." : "Entra"}
          </button>
        </form>

        <Link
          href="/"
          className="block mt-6 text-sm text-ink-soft text-center hover:text-accent transition-colors"
        >
          ← Torna alla home
        </Link>
      </div>
    </main>
  );
}
