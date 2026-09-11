"use client";

import { useRef, useState } from "react";

export default function MusicPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }

    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => setUnavailable(true));
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <audio ref={audioRef} src={src} loop onError={() => setUnavailable(true)} />
      <button
        type="button"
        onClick={toggle}
        disabled={unavailable}
        aria-label={playing ? "Metti in pausa la musica" : "Riproduci musica"}
        title={unavailable ? `Aggiungi il file audio in public${src}` : undefined}
        className="w-14 h-14 rounded-full bg-ink text-paper-card shadow-md flex items-center justify-center hover:bg-ink-soft transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <span className={playing ? "animate-pulse text-xl" : "text-xl"} aria-hidden>
          {playing ? "⏸" : "♪"}
        </span>
      </button>
      <p className="stub-label">
        {unavailable
          ? "Musica non disponibile"
          : playing
          ? "In riproduzione"
          : "Ascolta la musica"}
      </p>
    </div>
  );
}
