"use client";

import { useEffect, useState } from "react";

export default function HeroPhoto({ src, alt }: { src: string; alt: string }) {
  const [mounted, setMounted] = useState(false);
  const [errored, setErrored] = useState(false);

  // Renderizza l'<img> solo lato client: se la mettessimo nell'HTML server-rendered,
  // il browser potrebbe far partire ed errorare la richiesta prima che React
  // attacchi onError durante l'hydration, perdendo l'evento.
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="w-full h-72 sm:h-80 bg-ink/5" />;
  }

  if (errored) {
    return (
      <div className="w-full h-72 sm:h-80 flex items-center justify-center bg-ink/5 border-b border-ink/10 px-6 text-center">
        <p className="stub-label">
          Aggiungi la foto in <span className="text-ink normal-case">public{src}</span>
        </p>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setErrored(true)}
      className="w-full h-72 sm:h-80 object-cover"
    />
  );
}
