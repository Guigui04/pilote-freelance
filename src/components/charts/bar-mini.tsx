"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export function BarMini({
  data,
  dataKey,
  color = "#6366f1",
  unit = "",
}: {
  data: { name: string; [k: string]: string | number }[];
  dataKey: string;
  color?: string;
  unit?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
        <XAxis type="number" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis type="category" dataKey="name" fontSize={11} width={110} tickLine={false} axisLine={false} />
        <Tooltip
          formatter={(v: number) => `${v}${unit}`}
          contentStyle={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Bar dataKey={dataKey} fill={color} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
