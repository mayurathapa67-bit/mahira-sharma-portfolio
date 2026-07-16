"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  ZAxis,
} from "recharts";
import type { ChartPoint } from "@/lib/types";

const ACCENTS = ["#10b981", "#06b6d4", "#3b82f6"];

interface TooltipPayloadItem {
  name?: string;
  value?: number | string;
  payload?: Record<string, unknown>;
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="glass-dark rounded-lg px-3 py-2 text-xs text-white shadow-xl">
      {label ? <p className="mb-1 font-medium">{label}</p> : null}
      {payload.map((item, i) => (
        <p key={i} className="font-data">
          {item.name}: {typeof item.value === "number"
            ? item.value.toLocaleString("en-US")
            : item.value}
        </p>
      ))}
    </div>
  );
}

export function TrafficAreaChart({ data }: { data: ChartPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.55} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="dataFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
        <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
        <Tooltip content={<ChartTooltip />} />
        <Area
          type="monotone"
          dataKey="value"
          name="Sessions"
          stroke="#10b981"
          strokeWidth={2}
          fill="url(#growthFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function KeywordPieChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={48}
          outerRadius={88}
          paddingAngle={3}
          stroke="none"
        >
          {data.map((entry, i) => (
            <Cell key={entry.name} fill={ACCENTS[i % ACCENTS.length]} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: 11, color: "#94a3b8" }}
          iconType="circle"
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function TechnicalBarChart({
  data,
}: {
  data: { metric: string; score: number }[];
}) {
  const colorFor = (score: number) =>
    score >= 90 ? "#10b981" : score >= 70 ? "#06b6d4" : "#3b82f6";
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
        <XAxis dataKey="metric" stroke="#94a3b8" fontSize={11} tickLine={false} />
        <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(148,163,184,0.08)" }} />
        <Bar dataKey="score" name="Health" radius={[6, 6, 0, 0]}>
          {data.map((entry) => (
            <Cell key={entry.metric} fill={colorFor(entry.score)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function BacklinkScatterChart({
  data,
}: {
  data: { domain_authority: number; referring: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <ScatterChart margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
        <XAxis
          type="number"
          dataKey="domain_authority"
          name="Domain Authority"
          stroke="#94a3b8"
          fontSize={11}
          tickLine={false}
        />
        <YAxis
          type="number"
          dataKey="referring"
          name="Referring Domains"
          stroke="#94a3b8"
          fontSize={11}
          tickLine={false}
        />
        <ZAxis range={[60, 400]} />
        <Tooltip content={<ChartTooltip />} cursor={{ strokeDasharray: "3 3" }} />
        <Scatter data={data} fill="#3b82f6" fillOpacity={0.65} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
