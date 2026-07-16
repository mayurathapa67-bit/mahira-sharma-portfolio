"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";
import { Activity } from "lucide-react";

/**
 * Live traffic counter. Seeds from the server-provided baseline and increments
 * on an interval to simulate a real-time mock API feed (per spec: updates ~10s).
 */
export function LiveTrafficCounter({ initial }: { initial: number }) {
  const [value, setValue] = useState(initial);
  const ref = useRef(initial);

  useEffect(() => {
    const id = setInterval(() => {
      const delta = Math.floor(Math.random() * 240) + 40;
      const next = ref.current + delta;
      const controls = animate(ref.current, next, {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (v) => {
          ref.current = v;
          setValue(Math.round(v));
        },
      });
      return () => controls.stop();
    }, 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="inline-flex items-center gap-3 rounded-xl border border-data/30 bg-data/10 px-5 py-3">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-growth opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-growth" />
      </span>
      <div className="text-left">
        <p className="font-data text-2xl font-bold text-white">
          {value.toLocaleString("en-US")}
        </p>
        <p className="flex items-center gap-1 text-xs text-data">
          <Activity size={12} /> Total Traffic · live
        </p>
      </div>
    </div>
  );
}
