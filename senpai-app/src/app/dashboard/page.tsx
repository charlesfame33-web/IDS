"use client";

import { motion } from "framer-motion";
import {
  MessageSquareText,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Activity,
  RefreshCw,
} from "lucide-react";
import { Counter } from "@/components/ui/Counter";
import {
  TrendChart,
  DistributionChart,
  ComparisonChart,
} from "@/components/dashboard/Charts";
import {
  REVIEWS,
  FINTECHS,
  KEYWORDS,
  totalReviews,
  overallSentiment,
  Sentiment,
} from "@/lib/data";

const sentimentColor: Record<Sentiment, string> = {
  positive: "var(--positive)",
  neutral: "var(--neutral)",
  negative: "var(--negative)",
};

function fintechName(id: string) {
  return FINTECHS.find((f) => f.id === id)?.name ?? id;
}

const cardIn = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function DashboardPage() {
  const overall = overallSentiment();
  const total = totalReviews();

  const statCards = [
    { label: "Total Reviews", value: total, suffix: "", icon: MessageSquareText, color: "var(--accent)" },
    { label: "Positive", value: overall.positive, suffix: "%", icon: ThumbsUp, color: "var(--positive)" },
    { label: "Neutral", value: overall.neutral, suffix: "%", icon: Minus, color: "var(--neutral)" },
    { label: "Negative", value: overall.negative, suffix: "%", icon: ThumbsDown, color: "var(--negative)" },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold md:text-3xl">Command Center</h1>
          <p className="mt-1 flex items-center gap-2 text-sm text-muted">
            <span className="pulse-dot h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
            Neural engine online · monitoring {FINTECHS.length} fintechs
          </p>
        </div>
        <button
          className="glow-accent flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--border-accent)] bg-[var(--surface)] px-4 py-2.5 text-sm font-semibold text-accent transition-transform hover:scale-[1.03] active:scale-95"
          aria-label="Fetch latest reviews"
        >
          <RefreshCw size={15} aria-hidden="true" />
          Fetch Latest
        </button>
      </div>

      {/* Stat cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {statCards.map((s, i) => (
          <motion.div
            key={s.label}
            variants={cardIn}
            initial="hidden"
            animate="show"
            custom={i}
            className="glass rounded-2xl p-4 lg:p-5"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-medium tracking-wide text-muted uppercase">{s.label}</p>
              <span
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{
                  background: `color-mix(in srgb, ${s.color} 15%, transparent)`,
                  color: s.color,
                }}
              >
                <s.icon size={15} aria-hidden="true" />
              </span>
            </div>
            <Counter
              to={s.value}
              suffix={s.suffix}
              className="font-display text-2xl font-bold lg:text-3xl"
            />
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <motion.div
          variants={cardIn}
          initial="hidden"
          animate="show"
          custom={4}
          className="glass rounded-2xl p-5 lg:col-span-2"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display font-semibold">Sentiment Trend</h2>
            <span className="text-xs text-muted">Last 7 days · % positive</span>
          </div>
          <div className="h-64">
            <TrendChart />
          </div>
        </motion.div>

        <motion.div
          variants={cardIn}
          initial="hidden"
          animate="show"
          custom={5}
          className="glass rounded-2xl p-5"
        >
          <h2 className="font-display mb-4 font-semibold">Overall Distribution</h2>
          <div className="h-64">
            <DistributionChart />
          </div>
        </motion.div>
      </div>

      {/* Comparison + keywords */}
      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <motion.div
          variants={cardIn}
          initial="hidden"
          animate="show"
          custom={6}
          className="glass rounded-2xl p-5 lg:col-span-2"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display font-semibold">Fintech Comparison</h2>
            <span className="text-xs text-muted">Sentiment split by platform</span>
          </div>
          <div className="h-72">
            <ComparisonChart />
          </div>
        </motion.div>

        <motion.div
          variants={cardIn}
          initial="hidden"
          animate="show"
          custom={7}
          className="glass rounded-2xl p-5"
        >
          <h2 className="font-display mb-4 font-semibold">Keyword Intelligence</h2>
          <p className="mb-2 text-xs font-medium tracking-wide uppercase" style={{ color: "var(--positive)" }}>
            Top positive
          </p>
          <div className="mb-4 flex flex-wrap gap-1.5">
            {KEYWORDS.positive.slice(0, 5).map((k) => (
              <span
                key={k.word}
                className="rounded-full px-2.5 py-1 text-xs"
                style={{
                  background: "color-mix(in srgb, var(--positive) 14%, transparent)",
                  color: "var(--positive)",
                }}
              >
                {k.word} · {k.count.toLocaleString()}
              </span>
            ))}
          </div>
          <p className="mb-2 text-xs font-medium tracking-wide uppercase" style={{ color: "var(--negative)" }}>
            Top negative
          </p>
          <div className="flex flex-wrap gap-1.5">
            {KEYWORDS.negative.slice(0, 5).map((k) => (
              <span
                key={k.word}
                className="rounded-full px-2.5 py-1 text-xs"
                style={{
                  background: "color-mix(in srgb, var(--negative) 14%, transparent)",
                  color: "var(--negative)",
                }}
              >
                {k.word} · {k.count.toLocaleString()}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Live feed */}
      <motion.div
        variants={cardIn}
        initial="hidden"
        animate="show"
        custom={8}
        className="glass rounded-2xl p-5"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display flex items-center gap-2 font-semibold">
            <Activity size={16} className="text-accent" aria-hidden="true" />
            Live Review Feed
          </h2>
          <span className="text-xs text-muted">{REVIEWS.length} most recent</span>
        </div>
        <ul className="divide-y divide-[var(--border)]">
          {REVIEWS.slice(0, 8).map((r) => (
            <li key={r.id} className="flex items-start gap-3 py-3">
              <span
                className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: sentimentColor[r.sentiment] }}
                role="img"
                aria-label={`${r.sentiment} sentiment`}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-relaxed">{r.text}</p>
                <p className="mt-1 text-xs text-muted">
                  {r.author} · {fintechName(r.fintech)} · {r.source} · {r.date} ·{" "}
                  {Math.round(r.confidence * 100)}% confidence
                </p>
              </div>
              <span
                className="shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize"
                style={{
                  background: `color-mix(in srgb, ${sentimentColor[r.sentiment]} 14%, transparent)`,
                  color: sentimentColor[r.sentiment],
                }}
              >
                {r.sentiment}
              </span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
