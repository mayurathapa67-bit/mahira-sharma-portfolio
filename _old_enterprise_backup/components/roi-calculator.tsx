"use client";

import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";

export function RoiCalculator({ baseMultiplier }: { baseMultiplier: number }) {
  const [budget, setBudget] = useState(5000);
  const projection = useMemo(
    () => Math.round(budget * baseMultiplier),
    [budget, baseMultiplier],
  );

  return (
    <div className="rounded-2xl border border-space-600/20 bg-white p-6 dark:bg-space-700/60">
      <div className="flex items-center gap-2">
        <Calculator size={18} className="text-growth" />
        <h3 className="font-heading text-lg font-bold">ROI Calculator</h3>
      </div>
      <p className="mt-1 text-sm text-space/60 dark:text-white/60">
        Estimate projected annual organic revenue impact.
      </p>
      <label
        htmlFor="budget"
        className="mt-4 block text-sm font-medium"
      >
        Monthly investment: ${budget.toLocaleString("en-US")}
      </label>
      <input
        id="budget"
        type="range"
        min={1000}
        max={25000}
        step={500}
        value={budget}
        onChange={(e) => setBudget(Number(e.target.value))}
        className="mt-2 w-full accent-growth"
      />
      <div className="mt-4 rounded-xl bg-growth/10 p-4">
        <p className="text-xs uppercase tracking-wider text-space/50 dark:text-white/50">
          Projected annual impact
        </p>
        <p className="font-data text-3xl font-bold text-growth">
          ${projection.toLocaleString("en-US")}
        </p>
        <p className="mt-1 text-xs text-space/50 dark:text-white/50">
          Based on a {baseMultiplier.toFixed(1)}× return multiple.
        </p>
      </div>
    </div>
  );
}
