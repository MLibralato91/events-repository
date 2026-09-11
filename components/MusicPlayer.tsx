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
    <>
      <audio ref={audioRef} src={src} loop onError={() => setUnavailable(true)} />
      <button
        type="button"
        onClick={toggle}
        disabled={unavailable}
        aria-label={playing ? "Metti in pausa la musica" : "Riproduci musica"}
        title={unavailable ? `Aggiungi il file audio in public${src}` : undefined}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-ink text-paper-card shadow-lg flex items-center justify-center hover:bg-ink-soft transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <span className={playing ? "animate-pulse" : ""} aria-hidden>
          {playing ? "⏸" : "♪"}
        </span>
      </button>
    </>
  );
}
