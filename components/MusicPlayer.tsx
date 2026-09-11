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
      <div className="relative w-14 h-14">
        {!playing && !unavailable && (
          <>
            <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-75" aria-hidden />
            <span className="absolute -inset-2 rounded-full bg-accent/20 animate-pulse" aria-hidden />
          </>
        )}
        <button
          type="button"
          onClick={toggle}
          disabled={unavailable}
          aria-label={playing ? "Silenzia la musica" : "Riproduci musica"}
          title={unavailable ? `Aggiungi il file audio in public${src}` : undefined}
          className={`relative w-14 h-14 rounded-full shadow-md flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
            playing ? "bg-ink text-paper-card hover:bg-ink-soft" : "bg-accent text-paper-card hover:bg-accent/90"
          }`}
        >
          <span className="text-xl" aria-hidden>
            {playing ? "⏸" : "♪"}
          </span>
        </button>
      </div>
      <p className="stub-label font-semibold text-center whitespace-nowrap">
        {unavailable
          ? "Musica non disponibile"
          : playing
          ? "Questo è solo un assaggio"
          : "Non sei pronto per l'evento dell'anno"}
      </p>
    </div>
  );
}
