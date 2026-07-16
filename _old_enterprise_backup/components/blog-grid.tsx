"use client";

import { useMemo, useState } from "react";
import { Clock, TrendingUp, Flame } from "lucide-react";
import type { BlogArticle } from "@/lib/types";

const CATEGORIES = [
  "All",
  "Technical SEO",
  "Content Strategy",
  "Algorithm Updates",
] as const;

export function BlogGrid({ articles }: { articles: BlogArticle[] }) {
  const [active, setActive] = useState<(typeof CATEGORIES)[number]>("All");

  const filtered = useMemo(
    () =>
      active === "All"
        ? articles
        : articles.filter((a) => a.category === active),
    [articles, active],
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={active === c}
            onClick={() => setActive(c)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              active === c
                ? "bg-growth text-space"
                : "border border-space-600/20 text-space/70 dark:text-white/70"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Masonry via CSS columns */}
      <div className="mt-8 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
        {filtered.map((article) => (
          <article
            key={article.slug}
            className="break-inside-avoid rounded-2xl border border-space-600/20 bg-white p-5 shadow-sm transition-shadow hover:shadow-xl dark:bg-space-700/60"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-data/10 px-2.5 py-0.5 text-xs font-medium text-data">
                {article.category}
              </span>
              <span
                className={`flex items-center gap-1 text-xs ${
                  article.difficulty === "Advanced"
                    ? "text-growth"
                    : article.difficulty === "Intermediate"
                      ? "text-data"
                      : "text-trust"
                }`}
              >
                <Flame size={12} /> {article.difficulty}
              </span>
            </div>
            <h3 className="mt-3 font-heading text-lg font-bold leading-snug">
              {article.title}
            </h3>
            <p className="mt-2 text-sm text-space/60 dark:text-white/60">
              {article.excerpt}
            </p>
            <div className="mt-4 flex items-center justify-between text-xs text-space/50 dark:text-white/50">
              <span className="flex items-center gap-1">
                <Clock size={12} /> {article.read_time} min
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp size={12} />{" "}
                {article.traffic_potential.toLocaleString("en-US")} potential
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
