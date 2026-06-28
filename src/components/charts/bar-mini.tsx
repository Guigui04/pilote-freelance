"use client";

import dynamic from "next/dynamic";

// recharts (~100 kB) chargé en chunk séparé après hydratation.
const BarMiniImpl = dynamic(
  () => import("./bar-mini-impl").then((m) => m.BarMiniImpl),
  {
    ssr: false,
    loading: () => <div className="h-[260px] animate-pulse rounded-xl bg-muted" />,
  }
);

export function BarMini(props: {
  data: { name: string; [k: string]: string | number }[];
  dataKey: string;
  color?: string;
  unit?: string;
}) {
  return <BarMiniImpl {...props} />;
}
