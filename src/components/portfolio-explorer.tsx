"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ArrowUpRight } from "lucide-react";
import type { CaseStudy } from "@/lib/types";
import { Reveal } from "./reveal";

const CATEGORIES = [
  "All",
  "Technical SEO",
  "Content Strategy",
  "Local SEO",
] as const;

export function PortfolioExplorer({ studies }: { studies: CaseStudy[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return studies.filter((s) => {
      const matchCat = category === "All" || s.category === category;
      const matchQ =
        q === "" ||
        s.title.toLowerCase().includes(q) ||
        s.client.toLowerCase().includes(q) ||
        s.excerpt.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [studies, query, category]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="absolute left-3 top-3 text-charcoal/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search case studies…"
            aria-label="Search case studies"
            className="w-full rounded-full border border-charcoal/15 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-teal"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                category === c
                  ? "bg-teal text-cream"
                  : "border border-charcoal/15 text-charcoal/70 hover:border-charcoal/40"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-charcoal/50">
        Showing{" "}
        <span className="font-semibold text-charcoal">{filtered.length}</span> of{" "}
        {studies.length}
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((study) => (
          <Reveal key={study.slug}>
            <Link
              href={`/portfolio/${study.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-charcoal/10 bg-white transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="aspect-[16/10] overflow-hidden bg-cream-deep">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={study.featured_image}
                  alt={study.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-teal/10 px-3 py-1 text-xs font-medium text-teal">
                    {study.category}
                  </span>
                  <span className="text-xs text-charcoal/40">{study.client}</span>
                </div>
                <h3 className="mt-3 font-heading text-xl font-bold leading-snug text-charcoal">
                  {study.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal/60">
                  {study.excerpt}
                </p>
                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-charcoal/10 pt-4">
                  {study.results.slice(0, 2).map((r) => (
                    <div key={r.label}>
                      <p className="font-heading text-lg font-bold text-teal">
                        {r.value}
                      </p>
                      <p className="text-[11px] uppercase tracking-wide text-charcoal/45">
                        {r.label}
                      </p>
                    </div>
                  ))}
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-teal">
                  Read case study <ArrowUpRight size={15} />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-charcoal/50">
          No case studies match your search.
        </p>
      ) : null}
    </div>
  );
}
