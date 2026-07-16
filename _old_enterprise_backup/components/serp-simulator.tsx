"use client";

import { useMemo, useState } from "react";
import { Search, TrendingUp } from "lucide-react";

const KEYWORDS: Record<string, { pos: number; traffic: number }> = {
  "enterprise seo": { pos: 1, traffic: 18400 },
  "technical seo audit": { pos: 2, traffic: 9900 },
  "saas seo strategy": { pos: 3, traffic: 6200 },
  "international seo": { pos: 2, traffic: 7400 },
  "seo consultant melbourne": { pos: 1, traffic: 3200 },
};

export function SerpSimulator() {
  const [keyword, setKeyword] = useState("");
  const result = useMemo(() => {
    const k = keyword.trim().toLowerCase();
    if (!k) return null;
    const exact = KEYWORDS[k];
    if (exact) return exact;
    // Deterministic mock estimate for unknown keywords.
    const seed = [...k].reduce((a, c) => a + c.charCodeAt(0), 0);
    const pos = (seed % 9) + 1;
    const traffic = Math.max(300, 12000 - seed * 7);
    return { pos, traffic: Math.abs(traffic) };
  }, [keyword]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <label htmlFor="serp-input" className="text-sm font-medium text-white/70">
        SERP Simulator — type a target keyword
      </label>
      <div className="mt-3 flex items-center gap-2 rounded-lg border border-white/15 bg-space px-3 py-2">
        <Search size={16} className="text-data" />
        <input
          id="serp-input"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="e.g. enterprise seo"
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
        />
      </div>

      {result ? (
        <div className="mt-4 flex items-center justify-between rounded-lg bg-space/60 px-4 py-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-white/50">
              Estimated position
            </p>
            <p className="font-data text-2xl font-bold text-growth">
              #{result.pos}
            </p>
          </div>
          <div className="text-right">
            <p className="flex items-center justify-end gap-1 text-xs uppercase tracking-wider text-white/50">
              <TrendingUp size={12} /> Monthly traffic
            </p>
            <p className="font-data text-2xl font-bold text-data">
              {result.traffic.toLocaleString("en-US")}
            </p>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-xs text-white/40">
          Try a keyword to see a projected ranking and traffic estimate.
        </p>
      )}
    </div>
  );
}
