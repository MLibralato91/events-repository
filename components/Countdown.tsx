"use client";

import { useEffect, useState } from "react";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
};

function getTimeLeft(target: Date): TimeLeft {
  const diff = target.getTime() - Date.now();
  const clamped = Math.max(diff, 0);
  return {
    days: Math.floor(clamped / (1000 * 60 * 60 * 24)),
    hours: Math.floor((clamped / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((clamped / (1000 * 60)) % 60),
    seconds: Math.floor((clamped / 1000) % 60),
    done: diff <= 0,
  };
}

const UNIT_LABELS = ["Giorni", "Ore", "Min", "Sec"] as const;

export default function Countdown({ target }: { target: Date }) {
  // null finché non montato: il valore dipende da Date.now(), che differisce
  // tra il render server e l'hydration client (il tempo passa nel mezzo) —
  // calcolarlo subito causerebbe un hydration mismatch sui secondi.
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTimeLeft(getTimeLeft(target));
    const id = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (!timeLeft) {
    return (
      <div className="grid grid-cols-4 gap-3">
        {UNIT_LABELS.map((label) => (
          <div key={label} className="text-center">
            <p className="font-serif text-3xl text-ink tabular-nums">--</p>
            <p className="stub-label mt-1">{label}</p>
          </div>
        ))}
      </div>
    );
  }

  if (timeLeft.done) {
    return <p className="font-serif text-xl text-center">È il grande giorno! 🎉</p>;
  }

  const units = [
    { label: "Giorni", value: timeLeft.days },
    { label: "Ore", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Sec", value: timeLeft.seconds },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {units.map((u) => (
        <div key={u.label} className="text-center">
          <p className="font-serif text-3xl text-ink tabular-nums">
            {String(u.value).padStart(2, "0")}
          </p>
          <p className="stub-label mt-1">{u.label}</p>
        </div>
      ))}
    </div>
  );
}
