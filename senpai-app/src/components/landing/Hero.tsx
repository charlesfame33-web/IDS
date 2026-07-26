"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Radar, TrendingUp, MessageSquareText } from "lucide-react";
import { Counter } from "@/components/ui/Counter";
import { FINTECHS, STATS, totalReviews } from "@/lib/data";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.12, duration: 0.6, ease: "easeOut" as const },
  }),
};

export function Hero() {
  return (
    <section className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-4 pb-16 pt-32">
      {/* Status chip */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={0}
        className="glass mb-6 flex items-center gap-2.5 rounded-full px-4 py-2 text-xs font-medium tracking-widest text-muted uppercase"
      >
        <span className="pulse-dot h-2 w-2 rounded-full bg-accent" />
        Neural engine online — scanning public feedback
      </motion.div>

      {/* Headline */}
      <motion.h1
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={1}
        className="font-display max-w-4xl text-center text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl"
      >
        <span className="text-gradient-silver">Beyond Words.</span>
        <br />
        <span className="text-gradient">Into Insight.</span>
      </motion.h1>

      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={2}
        className="mt-6 max-w-2xl text-center text-base leading-relaxed text-muted md:text-lg"
      >
        SENPAI is a Sentiment Engine for Neural Public Analytics &amp; Insights —
        it listens to thousands of live customer voices across Nigeria&apos;s top
        fintech apps and turns them into intelligence you can act on.
      </motion.p>

      {/* CTAs */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={3}
        className="mt-9 flex flex-wrap items-center justify-center gap-4"
      >
        <Link
          href="/dashboard"
          className="glow-accent group flex cursor-pointer items-center gap-2 rounded-xl px-6 py-3.5 font-semibold text-[var(--bg)] transition-transform hover:scale-[1.04] active:scale-95"
          style={{ background: "linear-gradient(120deg, var(--accent), var(--accent-2))" }}
        >
          Enter Command Center
          <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
        </Link>
        <a
          href="#fintechs"
          className="glass cursor-pointer rounded-xl px-6 py-3.5 font-semibold text-text-base transition-all hover:border-[var(--border-accent)]"
        >
          View Live Sentiment
        </a>
      </motion.div>

      {/* Stats row */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={4}
        className="mt-14 grid w-full max-w-3xl grid-cols-3 gap-3 md:gap-4"
      >
        {[
          { icon: MessageSquareText, label: "Reviews analyzed", value: totalReviews(), suffix: "+" },
          { icon: Radar, label: "Fintechs tracked", value: FINTECHS.length, suffix: "" },
          { icon: TrendingUp, label: "Avg. positive sentiment", value: 74, suffix: "%" },
        ].map((s) => (
          <div key={s.label} className="glass rounded-2xl p-4 text-center md:p-6">
            <s.icon size={20} className="mx-auto mb-2 text-accent" aria-hidden="true" />
            <Counter
              to={s.value}
              suffix={s.suffix}
              className="font-display block text-2xl font-bold md:text-3xl"
            />
            <p className="mt-1 text-[11px] text-muted md:text-xs">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Floating fintech sentiment cards */}
      <div id="fintechs" className="mt-16 grid w-full max-w-5xl scroll-mt-28 grid-cols-2 gap-4 lg:grid-cols-4">
        {FINTECHS.map((f, i) => {
          const stats = STATS[f.id];
          return (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
              className={`glass relative overflow-hidden rounded-2xl p-5 ${
                i % 2 === 0 ? "animate-float" : "animate-float-slow"
              }`}
            >
              <div className="scanline" aria-hidden="true" />
              <div className="mb-3 flex items-center gap-3">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl font-display text-sm font-bold text-white"
                  style={{ background: f.color }}
                  aria-hidden="true"
                >
                  {f.name.slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-display font-semibold">{f.name}</p>
                  <p className="truncate text-[11px] text-muted">
                    {f.guardian} · {f.guardianTitle}
                  </p>
                </div>
              </div>

              <div className="mb-2 flex items-end justify-between">
                <span className="font-display text-3xl font-bold" style={{ color: f.color }}>
                  {stats.positive}%
                </span>
                <span className="text-[11px] text-muted">positive</span>
              </div>

              {/* Sentiment split bar */}
              <div
                className="flex h-1.5 w-full overflow-hidden rounded-full"
                role="img"
                aria-label={`${f.name}: ${stats.positive}% positive, ${stats.neutral}% neutral, ${stats.negative}% negative`}
              >
                <span style={{ width: `${stats.positive}%`, background: "var(--positive)" }} />
                <span style={{ width: `${stats.neutral}%`, background: "var(--neutral)" }} />
                <span style={{ width: `${stats.negative}%`, background: "var(--negative)" }} />
              </div>
              <p className="mt-2 text-[11px] text-muted">
                {stats.total.toLocaleString()} reviews · score {stats.score}/10
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
