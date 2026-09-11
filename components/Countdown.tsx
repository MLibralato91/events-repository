"use client";

import { useEffect, useState } from "react";

function getTimeLeft(target: Date) {
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

export default function Countdown({ target }: { target: Date }) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(target));

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

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
