"use client";

import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts";
import type { ChartPoint } from "@/lib/types";

export function Sparkline({
  data,
  color = "#10b981",
}: {
  data: ChartPoint[];
  color?: string;
}) {
  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  return (
    <ResponsiveContainer width="100%" height={48}>
      <LineChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <YAxis hide domain={[min * 0.95, max * 1.05]} />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
