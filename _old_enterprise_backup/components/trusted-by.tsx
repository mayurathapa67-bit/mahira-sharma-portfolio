"use client";

import { useEffect, useState } from "react";
import type { ContentPayload } from "@/lib/types";

function LogoMark({ name }: { name: string }) {
  return (
    <div className="group relative flex h-16 w-44 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4">
      <span className="font-heading text-base font-bold text-white/80 transition-colors group-hover:text-growth">
        {name}
      </span>
      <span className="pointer-events-none absolute -bottom-7 hidden whitespace-nowrap rounded bg-space px-2 py-1 text-xs text-white/70 group-hover:block">
        Client since 2021
      </span>
    </div>
  );
}

export function TrustedBy({ clients }: { clients: ContentPayload["clients"] }) {
  const [paused, setPaused] = useState(false);
  const loop = [...clients, ...clients];

  useEffect(() => {
    const track = document.getElementById("marquee");
    if (!track) return;
    track.style.animationPlayState = paused ? "paused" : "running";
  }, [paused]);

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Trusted by leading enterprises"
    >
      <div id="marquee" className="marquee-track gap-4 py-2">
        {loop.map((client, i) => (
          <LogoMark key={`${client.name}-${i}`} name={client.name} />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-space to-transparent dark:from-space" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-space to-transparent dark:from-space" />
    </div>
  );
}
