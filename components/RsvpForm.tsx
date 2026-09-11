"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import clsx from "clsx";

const schema = z.object({
  nome: z.string().min(2, "Inserisci il tuo nome"),
  cognome: z.string().min(2, "Inserisci il tuo cognome"),
  email: z.string().email("Email non valida"),
  partecipa: z.enum(["si", "no"], { required_error: "Seleziona una risposta" }),
  accompagnato: z.enum(["si", "no"]).optional(),
  nome_accompagnatore: z.string().optional(),
  note: z.string().optional(),
}).refine(
  (data) => {
    if (data.partecipa === "si" && data.accompagnato === "si") {
      return data.nome_accompagnatore && data.nome_accompagnatore.length >= 2;
    }
    return true;
  },
  {
    message: "Inserisci il nome del tuo accompagnatore",
    path: ["nome_accompagnatore"],
  }
);

type FormData = z.infer<typeof schema>;

// ─── Componenti UI riusabili ───────────────────────────────────────────────

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-[#C5B99A] mb-1.5">
      {children}
      {required && <span className="text-gold ml-1">*</span>}
    </label>
  );
}

function Input({ error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  return (
    <div>
      <input
        {...props}
        className={clsx(
          "w-full px-4 py-3 rounded-lg bg-[#1A1A1A] border text-[#F5F0E8] placeholder-[#555]",
          "focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/60 transition-all",
          error ? "border-red-500/60" : "border-[#2A2A2A]"
        )}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

function RadioGroup({
  name,
  options,
  value,
  onChange,
  error,
}: {
  name: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div>
      <div className="flex gap-3">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={clsx(
              "flex-1 py-3 px-4 rounded-lg border text-sm font-medium transition-all duration-200",
              value === opt.value
                ? "bg-gold/10 border-gold text-gold"
                : "bg-[#1A1A1A] border-[#2A2A2A] text-[#888] hover:border-gold/40 hover:text-[#C5B99A]"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

// ─── Componente principale ─────────────────────────────────────────────────

export default function RsvpForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const partecipa = watch("partecipa");
  const accompagnato = watch("accompagnato");

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Qualcosa è andato storto");
      }

      router.push("/conferma");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Errore imprevisto");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/* Nome e Cognome */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label required>Nome</Label>
          <Input
            {...register("nome")}
            placeholder="Mario"
            error={errors.nome?.message}
          />
        </div>
        <div>
          <Label required>Cognome</Label>
          <Input
            {...register("cognome")}
            placeholder="Rossi"
            error={errors.cognome?.message}
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <Label required>Email</Label>
        <Input
          {...register("email")}
          type="email"
          placeholder="mario@rossi.it"
          error={errors.email?.message}
        />
        <p className="mt-1 text-xs text-[#666]">Riceverai una conferma a questo indirizzo</p>
      </div>

      {/* Parteciperò */}
      <div>
        <Label required>Parteciperò alla festa</Label>
        <RadioGroup
          name="partecipa"
          options={[
            { value: "si", label: "🥂 Ci sarò!" },
            { value: "no", label: "😔 Non posso venire" },
          ]}
          value={partecipa}
          onChange={(v) => setValue("partecipa", v as "si" | "no", { shouldValidate: true })}
          error={errors.partecipa?.message}
        />
      </div>

      {/* Sezione visibile solo se partecipa */}
      {partecipa === "si" && (
        <div className="space-y-6 animate-fade-up">
          {/* Accompagnatore */}
          <div>
            <Label>Vengo con un accompagnatore</Label>
            <RadioGroup
              name="accompagnato"
              options={[
                { value: "si", label: "Sì" },
                { value: "no", label: "No, vengo da solo" },
              ]}
              value={accompagnato}
              onChange={(v) => setValue("accompagnato", v as "si" | "no", { shouldValidate: true })}
            />
          </div>

          {/* Nome accompagnatore */}
          {accompagnato === "si" && (
            <div className="animate-fade-up">
              <Label required>Nome e cognome accompagnatore</Label>
              <Input
                {...register("nome_accompagnatore")}
                placeholder="Lucia Bianchi"
                error={errors.nome_accompagnatore?.message}
              />
            </div>
          )}

          {/* Note */}
          <div>
            <Label>Note (opzionale)</Label>
            <textarea
              {...register("note")}
              rows={3}
              placeholder="Intolleranze alimentari, allergie, ecc."
              className={clsx(
                "w-full px-4 py-3 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F0E8]",
                "placeholder-[#555] resize-none",
                "focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/60 transition-all"
              )}
            />
          </div>
        </div>
      )}

      {/* Errore server */}
      {serverError && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {serverError}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={clsx(
          "w-full py-4 rounded-lg font-semibold text-dark transition-all duration-300",
          "bg-gradient-to-r from-gold-dark via-gold to-gold-light",
          "hover:shadow-[0_0_30px_rgba(201,168,76,0.4)] hover:scale-[1.01]",
          "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none",
          "text-[#0A0A0A]"
        )}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Invio in corso…
          </span>
        ) : (
          "Conferma la mia presenza ✨"
        )}
      </button>
    </form>
  );
}
