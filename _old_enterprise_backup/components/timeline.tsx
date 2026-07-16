"use client";

import { motion } from "framer-motion";
import type { TimelineMilestone } from "@/lib/types";

export function Timeline({ items }: { items: TimelineMilestone[] }) {
  return (
    <ol className="relative ml-4 border-l border-space-600/30">
      {items.map((item, i) => (
        <motion.li
          key={item.year}
          className="relative mb-10 pl-8"
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
        >
          <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-growth bg-white dark:bg-space" />
          <p className="font-data text-sm font-bold text-growth">{item.year}</p>
          <p className="mt-1 font-heading text-lg font-bold">{item.achievement}</p>
          <p className="mt-1 text-sm text-trust">{item.impact}</p>
        </motion.li>
      ))}
    </ol>
  );
}
