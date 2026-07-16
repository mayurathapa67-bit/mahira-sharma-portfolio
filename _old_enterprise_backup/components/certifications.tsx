"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Certification, ToolProficiency } from "@/lib/types";

export function Certifications({ items }: { items: Certification[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {items.map((cert) => (
        <div
          key={cert.acronym}
          className="group relative flex flex-col items-center rounded-2xl border border-space-600/20 bg-white p-5 text-center shadow-sm transition-transform hover:-translate-y-1 dark:bg-space-700/60"
        >
          <span className="grid h-14 w-14 place-items-center rounded-xl bg-gradient-to-br from-trust to-data font-heading text-lg font-extrabold text-white">
            {cert.acronym}
          </span>
          <p className="mt-3 text-sm font-semibold">{cert.name}</p>
          <p className="text-xs text-space/50 dark:text-white/50">{cert.issuer}</p>
          <div className="pointer-events-none absolute inset-x-3 bottom-3 hidden rounded-lg bg-space p-3 text-left text-xs text-white/80 group-hover:block">
            <p>Issued: {cert.issued}</p>
            <p>Valid: {cert.valid_until}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ToolGrid({ items }: { items: ToolProficiency[] }) {
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((tool) => (
        <div
          key={tool.name}
          onMouseEnter={() => setHovered(tool.name)}
          onMouseLeave={() => setHovered(null)}
          className="rounded-2xl border border-space-600/20 bg-white p-5 shadow-sm dark:bg-space-700/60"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-heading font-bold">{tool.name}</p>
              <p className="text-xs text-space/50 dark:text-white/50">
                {tool.category}
              </p>
            </div>
            <span className="font-data text-sm font-bold text-growth">
              {tool.proficiency}%
            </span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-space-600/20">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-growth to-data"
              initial={{ width: 0 }}
              animate={{ width: hovered === tool.name ? `${tool.proficiency}%` : `${tool.proficiency}%` }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
