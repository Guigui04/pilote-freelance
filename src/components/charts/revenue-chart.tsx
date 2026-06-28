"use client";

import dynamic from "next/dynamic";

// recharts (~100 kB) chargé en chunk séparé après hydratation : la page
// devient interactive sans attendre la librairie de graphiques.
const RevenueChartImpl = dynamic(
  () => import("./revenue-chart-impl").then((m) => m.RevenueChartImpl),
  {
    ssr: false,
    loading: () => <div className="h-[280px] animate-pulse rounded-xl bg-muted" />,
  }
);

export function RevenueChart(props: {
  data: { label: string; facture: number; encaisse: number }[];
}) {
  return <RevenueChartImpl {...props} />;
}
