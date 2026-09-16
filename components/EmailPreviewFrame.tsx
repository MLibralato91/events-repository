"use client";

import { useEffect, useRef, useState } from "react";

export default function EmailPreviewFrame({ html, title }: { html: string; title: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(200);

  useEffect(() => {
    const iframe = ref.current;
    if (!iframe) return;

    function measure() {
      const doc = iframe?.contentWindow?.document;
      if (doc?.documentElement) {
        setHeight(doc.documentElement.scrollHeight);
      }
    }

    // Con srcDoc il "load" può scattare prima che questo effect faccia in
    // tempo ad agganciare il listener: misuriamo anche subito al mount,
    // non solo sui load successivi.
    measure();
    iframe.addEventListener("load", measure);
    return () => iframe.removeEventListener("load", measure);
  }, [html]);

  return (
    <iframe
      ref={ref}
      srcDoc={html}
      title={title}
      style={{ height }}
      className="w-full block"
    />
  );
}
