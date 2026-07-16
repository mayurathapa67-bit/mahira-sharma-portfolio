"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, Calculator } from "lucide-react";
import type { PricingPlan } from "@/lib/types";

export function ServicesClient({ plans }: { plans: PricingPlan[] }) {
  const [selected, setSelected] = useState<PricingPlan>(plans[1] ?? plans[0]);
  const [budget, setBudget] = useState(6500);
  const projection = useMemo(
    () => Math.round(budget * selected.roi_multiplier),
    [budget, selected],
  );

  return (
    <div className="space-y-16">
      {/* Pricing tiers */}
      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative flex flex-col rounded-2xl border p-6 ${
              plan.highlighted
                ? "border-growth bg-growth/5 shadow-lg"
                : "border-space-600/20 bg-white dark:bg-space-700/60"
            }`}
          >
            {plan.highlighted ? (
              <span className="absolute -top-3 left-6 rounded-full bg-growth px-3 py-1 text-xs font-semibold text-space">
                Most popular
              </span>
            ) : null}
            <h3 className="font-heading text-xl font-bold">{plan.name}</h3>
            <p className="mt-1 text-sm text-space/60 dark:text-white/60">
              {plan.description}
            </p>
            <p className="mt-4">
              <span className="font-data text-3xl font-bold">
                ${plan.price.toLocaleString("en-US")}
              </span>
              <span className="text-sm text-space/50 dark:text-white/50">
                {" "}
                / {plan.cadence}
              </span>
            </p>
            <ul className="mt-5 flex-1 space-y-2 text-sm">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check size={16} className="mt-0.5 shrink-0 text-growth" />
                  <span className="text-space/70 dark:text-white/70">{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/contact"
              className={`mt-6 rounded-full px-5 py-2.5 text-center text-sm font-semibold transition-transform hover:scale-[1.03] ${
                plan.highlighted
                  ? "bg-growth text-space"
                  : "bg-trust text-white"
              }`}
            >
              Choose {plan.name}
            </Link>
          </div>
        ))}
      </div>

      {/* Interactive ROI */}
      <div className="rounded-3xl border border-space-600/20 bg-white p-8 dark:bg-space-700/60">
        <div className="flex items-center gap-2">
          <Calculator size={20} className="text-growth" />
          <h3 className="font-heading text-2xl font-extrabold">
            Interactive ROI Calculator
          </h3>
        </div>
        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Select a plan</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {plans.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={selected.id === p.id}
                  onClick={() => setSelected(p)}
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    selected.id === p.id
                      ? "bg-data text-white"
                      : "border border-space-600/20"
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
            <label htmlFor="inv" className="mt-6 block text-sm font-medium">
              Monthly budget: ${budget.toLocaleString("en-US")}
            </label>
            <input
              id="inv"
              type="range"
              min={1000}
              max={25000}
              step={500}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="mt-2 w-full accent-growth"
            />
          </div>
          <div className="grid place-items-center rounded-2xl bg-space p-8 text-center text-white">
            <div>
              <p className="text-xs uppercase tracking-wider text-white/50">
                Projected annual impact
              </p>
              <p className="font-data text-5xl font-bold text-growth">
                ${projection.toLocaleString("en-US")}
              </p>
              <p className="mt-2 text-sm text-white/60">
                {selected.name} plan · {selected.roi_multiplier.toFixed(1)}× return
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
