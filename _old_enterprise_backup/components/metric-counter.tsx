"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  useInView,
  useReducedMotion,
} from "framer-motion";

interface MetricCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  label?: string;
}

function formatNumber(value: number, decimals: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function MetricCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1.6,
  label,
}: MetricCounterProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(reduced ? value : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest: number) => setDisplay(latest),
    });
    return () => controls.stop();
  }, [inView, value, duration, reduced]);

  return (
    <span
      ref={ref}
      className="font-data font-medium tabular-nums"
      aria-label={label ?? `${prefix}${formatNumber(value, decimals)}${suffix}`}
    >
      {prefix}
      {formatNumber(display, decimals)}
      {suffix}
    </span>
  );
}
