"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ArrowUpRight } from "lucide-react";
import type { CaseStudy, Industry, ServiceCategory } from "@/lib/types";
import { MetricCounter } from "./metric-counter";
import { Sparkline } from "./sparkline";

const CATEGORIES: ServiceCategory[] = [
  "Technical SEO",
  "E-commerce",
  "SaaS",
  "International",
];
const INDUSTRIES: Industry[] = [
  "Finance",
  "E-commerce",
  "SaaS",
  "Healthcare",
  "Travel",
  "Education",
];

export function PortfolioExplorer({ studies }: { studies: CaseStudy[] }) {
  const [query, setQuery] = useState("");
  const [cats, setCats] = useState<Set<ServiceCategory>>(new Set());
  const [inds, setInds] = useState<Set<Industry>>(new Set());

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return studies.filter((s) => {
      const matchCat = cats.size === 0 || cats.has(s.category);
      const matchInd = inds.size === 0 || inds.has(s.industry);
      const matchQ =
        q === "" ||
        s.client.toLowerCase().includes(q) ||
        s.challenge.toLowerCase().includes(q);
      return matchCat && matchInd && matchQ;
    });
  }, [studies, query, cats, inds]);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return studies
      .filter((s) => s.client.toLowerCase().includes(q))
      .slice(0, 5)
      .map((s) => s.client);
  }, [query, studies]);

  const toggle = <T,>(set: Set<T>, value: T, setter: (s: Set<T>) => void) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
  };

  return (
    <div>
      {/* Controls */}
      <div className="rounded-2xl border border-space-600/20 bg-white p-5 dark:bg-space-700/60">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-3 text-space/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search case studies…"
            aria-label="Search case studies"
            className="w-full rounded-lg border border-space-600/20 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-data dark:bg-space"
            list="client-suggestions"
          />
          <datalist id="client-suggestions">
            {suggestions.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={cats.has(c)}
              onClick={() => toggle(cats, c, setCats)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                cats.has(c)
                  ? "bg-data text-white"
                  : "border border-space-600/20 text-space/70 dark:text-white/70"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {INDUSTRIES.map((i) => (
            <button
              key={i}
              type="button"
              aria-pressed={inds.has(i)}
              onClick={() => toggle(inds, i, setInds)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                inds.has(i)
                  ? "bg-trust text-white"
                  : "border border-space-600/20 text-space/70 dark:text-white/70"
              }`}
            >
              {i}
            </button>
          ))}
        </div>

        <p className="mt-4 font-data text-sm text-space/60 dark:text-white/60">
          Showing{" "}
          <span className="font-bold text-growth">{filtered.length}</span> of{" "}
          {studies.length} case studies
        </p>
      </div>

      {/* Grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((study) => (
          <article
            key={study.slug}
            className="flex flex-col overflow-hidden rounded-2xl border border-space-600/20 bg-white shadow-sm transition-shadow hover:shadow-xl dark:bg-space-700/60"
          >
            <div className="flex items-center justify-between p-5 pb-0">
              <span className="rounded-full bg-data/10 px-2.5 py-0.5 text-xs font-medium text-data">
                {study.category}
              </span>
              <span className="text-xs text-space/50 dark:text-white/50">
                {study.industry}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="font-heading text-lg font-bold">{study.client}</h3>
              <p className="mt-1 flex-1 text-sm text-space/60 dark:text-white/60">
                {study.challenge}
              </p>
              <div className="mt-4 flex items-end justify-between">
                <p className="font-data text-xl font-bold text-growth">
                  <MetricCounter value={study.results.traffic_growth} suffix="%" />
                </p>
                <div className="w-24">
                  <Sparkline data={study.results.chart_data} />
                </div>
              </div>
              <Link
                href={`/portfolio/${study.slug}`}
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-trust hover:text-growth"
              >
                View deep-dive <ArrowUpRight size={15} />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-space/50 dark:text-white/50">
          No case studies match your filters.
        </p>
      ) : null}
    </div>
  );
}
