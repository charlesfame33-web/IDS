"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { useTheme } from "@/components/theme/ThemeProvider";
import { FINTECHS, STATS, TREND_LABELS, overallSentiment } from "@/lib/data";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

interface ThemeColors {
  key: string;
  accent: string;
  accent2: string;
  text: string;
  muted: string;
  border: string;
  positive: string;
  neutral: string;
  negative: string;
}

/**
 * Read the active theme's CSS variables so charts recolor on theme switch.
 * Runs only after mount — getComputedStyle doesn't exist during SSR.
 */
function useThemeColors(): ThemeColors | null {
  const { theme } = useTheme();
  const [colors, setColors] = useState<ThemeColors | null>(null);

  useEffect(() => {
    const css = getComputedStyle(document.documentElement);
    const v = (name: string) => css.getPropertyValue(name).trim();
    setColors({
      key: theme,
      accent: v("--accent"),
      accent2: v("--accent-2"),
      text: v("--text"),
      muted: v("--muted"),
      border: v("--border"),
      positive: v("--positive"),
      neutral: v("--neutral"),
      negative: v("--negative"),
    });
  }, [theme]);

  return colors;
}

/** Shimmer placeholder while chart colors load on the client. */
function ChartSkeleton() {
  return (
    <div
      className="h-full w-full animate-pulse rounded-xl bg-[var(--surface)]"
      aria-hidden="true"
    />
  );
}

const baseGrid = (border: string, muted: string) => ({
  grid: { color: border },
  ticks: { color: muted, font: { size: 11 } },
  border: { display: false },
});

export function TrendChart() {
  const c = useThemeColors();
  if (!c) return <ChartSkeleton />;
  const data = {
    labels: TREND_LABELS,
    datasets: FINTECHS.map((f) => ({
      label: f.name,
      data: STATS[f.id].trend,
      borderColor: f.color,
      backgroundColor: `${f.color}22`,
      pointBackgroundColor: f.color,
      pointRadius: 3,
      tension: 0.45,
      fill: false,
      borderWidth: 2,
    })),
  };
  return (
    <Line
      key={c.key}
      data={data}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: c.muted, usePointStyle: true, boxWidth: 8, font: { size: 11 } },
          },
          tooltip: { intersect: false, mode: "index" },
        },
        scales: {
          x: baseGrid(c.border, c.muted),
          y: {
            ...baseGrid(c.border, c.muted),
            suggestedMin: 55,
            suggestedMax: 90,
            ticks: {
              color: c.muted,
              font: { size: 11 },
              callback: (v) => `${v}%`,
            },
          },
        },
      }}
      aria-label="Positive sentiment trend over the last 7 days for all fintechs"
    />
  );
}

export function DistributionChart() {
  const c = useThemeColors();
  const overall = overallSentiment();
  if (!c) return <ChartSkeleton />;
  const data = {
    labels: ["Positive", "Neutral", "Negative"],
    datasets: [
      {
        data: [overall.positive, overall.neutral, overall.negative],
        backgroundColor: [c.positive, c.neutral, c.negative],
        borderColor: "transparent",
        hoverOffset: 8,
      },
    ],
  };
  return (
    <Doughnut
      key={c.key}
      data={data}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: {
          legend: {
            position: "bottom",
            labels: { color: c.muted, usePointStyle: true, boxWidth: 8, font: { size: 11 } },
          },
        },
      }}
      aria-label={`Overall sentiment distribution: ${overall.positive}% positive, ${overall.neutral}% neutral, ${overall.negative}% negative`}
    />
  );
}

export function ComparisonChart() {
  const c = useThemeColors();
  if (!c) return <ChartSkeleton />;
  const data = {
    labels: FINTECHS.map((f) => f.name),
    datasets: [
      {
        label: "Positive",
        data: FINTECHS.map((f) => STATS[f.id].positive),
        backgroundColor: c.positive,
        borderRadius: 6,
      },
      {
        label: "Neutral",
        data: FINTECHS.map((f) => STATS[f.id].neutral),
        backgroundColor: c.neutral,
        borderRadius: 6,
      },
      {
        label: "Negative",
        data: FINTECHS.map((f) => STATS[f.id].negative),
        backgroundColor: c.negative,
        borderRadius: 6,
      },
    ],
  };
  return (
    <Bar
      key={c.key}
      data={data}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: c.muted, usePointStyle: true, boxWidth: 8, font: { size: 11 } },
          },
        },
        scales: {
          x: { ...baseGrid(c.border, c.muted), stacked: false },
          y: {
            ...baseGrid(c.border, c.muted),
            ticks: {
              color: c.muted,
              font: { size: 11 },
              callback: (v) => `${v}%`,
            },
          },
        },
      }}
      aria-label="Sentiment comparison across OPay, PalmPay, Moniepoint and FairMoney"
    />
  );
}
