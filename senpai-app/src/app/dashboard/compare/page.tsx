"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { ComparisonChart } from "@/components/dashboard/Charts";
import { FINTECHS, STATS, REVIEWS } from "@/lib/data";

export default function ComparePage() {
  const ranked = [...FINTECHS].sort((a, b) => STATS[b.id].score - STATS[a.id].score);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold md:text-3xl">Fintech Comparison</h1>
        <p className="mt-1 text-sm text-muted">
          Side-by-side sentiment battle — who do customers really trust?
        </p>
      </div>

      {/* Fintech battle cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {ranked.map((f, i) => {
          const s = STATS[f.id];
          const latest = REVIEWS.find((r) => r.fintech === f.id);
          return (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className={`glass relative overflow-hidden rounded-2xl p-5 ${
                i === 0 ? "glow-ring" : ""
              }`}
            >
              {i === 0 && (
                <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-[var(--surface)] px-2.5 py-1 text-[11px] font-semibold text-accent">
                  <Trophy size={12} aria-hidden="true" /> #1
                </span>
              )}

              <div className="mb-4 flex items-center gap-3">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-xl font-display font-bold text-white"
                  style={{ background: f.color }}
                  aria-hidden="true"
                >
                  {f.name.slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="font-display font-semibold">{f.name}</p>
                  <p className="truncate text-[11px] text-muted">
                    {f.guardian} · {f.guardianTitle}
                  </p>
                </div>
              </div>

              <div className="mb-4 flex items-end gap-2">
                <span className="font-display text-4xl font-bold" style={{ color: f.color }}>
                  {s.score}
                </span>
                <span className="pb-1.5 text-xs text-muted">/ 10 AI score</span>
              </div>

              <dl className="space-y-2 text-sm">
                {(
                  [
                    ["Positive", s.positive, "var(--positive)"],
                    ["Neutral", s.neutral, "var(--neutral)"],
                    ["Negative", s.negative, "var(--negative)"],
                  ] as const
                ).map(([label, value, color]) => (
                  <div key={label}>
                    <div className="mb-1 flex justify-between text-xs">
                      <dt className="text-muted">{label}</dt>
                      <dd className="font-semibold" style={{ color }}>
                        {value}%
                      </dd>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface)]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${value}%` }}
                        transition={{ delay: 0.3 + i * 0.08, duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ background: color }}
                      />
                    </div>
                  </div>
                ))}
              </dl>

              {latest && (
                <p className="mt-4 border-t border-[var(--border)] pt-3 text-xs leading-relaxed text-muted">
                  Latest: &ldquo;{latest.text.slice(0, 80)}
                  {latest.text.length > 80 ? "…" : ""}&rdquo;
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Full comparison chart */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="glass rounded-2xl p-5"
      >
        <h2 className="font-display mb-4 font-semibold">Head-to-Head Sentiment</h2>
        <div className="h-80">
          <ComparisonChart />
        </div>
      </motion.div>
    </div>
  );
}
