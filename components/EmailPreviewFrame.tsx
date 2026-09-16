"use client";

import { useRef, useState } from "react";

export default function EmailPreviewFrame({ html, title }: { html: string; title: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(200);

  function handleLoad() {
    const doc = ref.current?.contentWindow?.document;
    if (doc) {
      setHeight(doc.documentElement.scrollHeight);
    }
  }

  return (
    <iframe
      ref={ref}
      srcDoc={html}
      title={title}
      onLoad={handleLoad}
      style={{ height }}
      className="w-full block"
    />
  );
}
