"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, MoveHorizontal } from "lucide-react";
import type { CaseStudy } from "@/lib/types";
import { MetricCounter } from "./metric-counter";
import { Sparkline } from "./sparkline";

export function CaseStudyCard({ study }: { study: CaseStudy }) {
  const [position, setPosition] = useState(50);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const handleMove = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    handleMove(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons === 1) handleMove(e.clientX);
  };

  const growthPct = Math.round(
    ((study.before_after.after - study.before_after.before) /
      study.before_after.before) *
      100,
  );

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-space-600/20 bg-white shadow-sm transition-all hover:shadow-xl dark:bg-space-700/60">
      {/* Before / After slider */}
      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        className="relative h-40 touch-none select-none overflow-hidden bg-space"
        role="slider"
        aria-label="Before and after traffic comparison"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setPosition((p) => Math.max(0, p - 5));
          if (e.key === "ArrowRight") setPosition((p) => Math.min(100, p + 5));
        }}
      >
        <div
          className="absolute inset-0 grid place-items-center bg-gradient-to-br from-space-700 to-space text-center"
          aria-hidden
        >
          <div>
            <p className="font-data text-2xl font-bold text-white/50">
              {study.before_after.before.toLocaleString("en-US")}
            </p>
            <p className="text-xs uppercase tracking-wider text-white/40">Before</p>
          </div>
        </div>
        <div
          className="absolute inset-y-0 left-0 grid place-items-center overflow-hidden bg-gradient-to-br from-growth to-data text-center [width:var(--clip)]"
          style={{ ["--clip" as string]: `${position}%` }}
          aria-hidden
        >
          <div className="w-40">
            <p className="font-data text-2xl font-bold text-white">
              {study.before_after.after.toLocaleString("en-US")}
            </p>
            <p className="text-xs uppercase tracking-wider text-white/80">After</p>
          </div>
        </div>
        <div
          className="absolute inset-y-0 z-10 w-0.5 bg-white shadow"
          style={{ left: `${position}%` }}
          aria-hidden
        >
          <span className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-1 text-space">
            <MoveHorizontal size={14} />
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-data/10 px-2.5 py-0.5 text-xs font-medium text-data">
            {study.category}
          </span>
          <span className="text-xs text-space/50 dark:text-white/50">
            Client since {study.client_since}
          </span>
        </div>

        <h3 className="mt-3 font-heading text-lg font-bold">{study.client}</h3>
        <p className="mt-1 text-sm text-space/60 dark:text-white/60">
          {study.challenge}
        </p>

        <div className="mt-4 flex items-end gap-4">
          <div>
            <p className="font-data text-2xl font-bold text-growth">
              <MetricCounter value={study.results.traffic_growth} suffix="%" />
            </p>
            <p className="text-xs text-space/50 dark:text-white/50">Organic Traffic</p>
          </div>
          <div className="flex-1">
            <Sparkline data={study.results.chart_data} />
          </div>
        </div>

        <p className="mt-3 text-xs font-medium text-trust">
          <MetricCounter value={growthPct} prefix="+" suffix="% vs. baseline" />
        </p>

        <Link
          href={`/portfolio/${study.slug}`}
          className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-trust transition-colors hover:text-growth"
        >
          View deep-dive <ArrowUpRight size={15} />
        </Link>
      </div>
    </article>
  );
}
