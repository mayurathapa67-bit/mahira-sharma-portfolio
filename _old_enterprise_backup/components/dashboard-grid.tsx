"use client";

import {
  TrafficAreaChart,
  KeywordPieChart,
  TechnicalBarChart,
  BacklinkScatterChart,
} from "./results-chart";
import type {
  ChartPoint,
  DashboardMetrics,
} from "@/lib/types";

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-space-600/20 bg-white p-5 shadow-sm dark:bg-space-700/60">
      <div className="mb-3">
        <h3 className="font-heading text-sm font-bold">{title}</h3>
        <p className="text-xs text-space/50 dark:text-white/50">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

export function DashboardGrid({ metrics }: { metrics: DashboardMetrics }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Panel title="Traffic Growth" subtitle="Monthly organic sessions · 12 mo">
        <TrafficAreaChart data={metrics.traffic_growth} />
      </Panel>
      <Panel title="Keyword Distribution" subtitle="Share of tracked intents">
        <KeywordPieChart data={metrics.keyword_distribution} />
      </Panel>
      <Panel title="Technical SEO Health" subtitle="Core signal scores (0–100)">
        <TechnicalBarChart data={metrics.technical_health} />
      </Panel>
      <Panel title="Backlink Profile" subtitle="Authority vs. referring domains">
        <BacklinkScatterChart data={metrics.backlinks} />
      </Panel>
    </div>
  );
}

export type { ChartPoint };
