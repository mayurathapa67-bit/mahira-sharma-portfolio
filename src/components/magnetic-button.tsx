"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function MagneticButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline";
}) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  function onMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) / 6);
    y.set((e.clientY - (rect.top + rect.height / 2)) / 6);
  }
  function reset() {
    x.set(0);
    y.set(0);
  }

  const base =
    "inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-medium transition-colors";
  const styles =
    variant === "primary"
      ? "bg-teal text-cream hover:bg-teal-soft"
      : "border border-charcoal/20 text-charcoal hover:border-charcoal";

  return (
    <motion.div style={{ x: sx, y: sy }} className="inline-block">
      <Link
        ref={ref}
        href={href}
        onMouseMove={onMove}
        onMouseLeave={reset}
        className={`${base} ${styles}`}
      >
        {children}
      </Link>
    </motion.div>
  );
}
