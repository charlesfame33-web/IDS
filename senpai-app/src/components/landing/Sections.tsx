"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Radar,
  BrainCircuit,
  BarChart3,
  Scale,
  Search,
  ShieldCheck,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  Minus,
} from "lucide-react";
import { REVIEWS, FINTECHS, Sentiment } from "@/lib/data";

const sentimentMeta: Record<Sentiment, { icon: typeof ThumbsUp; color: string; label: string }> = {
  positive: { icon: ThumbsUp, color: "var(--positive)", label: "Positive" },
  neutral: { icon: Minus, color: "var(--neutral)", label: "Neutral" },
  negative: { icon: ThumbsDown, color: "var(--negative)", label: "Negative" },
};

function fintechName(id: string) {
  return FINTECHS.find((f) => f.id === id)?.name ?? id;
}

/** Infinite marquee of live-analyzed reviews. */
export function LiveTicker() {
  const doubled = [...REVIEWS, ...REVIEWS];
  return (
    <section aria-label="Live review feed" className="relative z-10 overflow-hidden py-6">
      <div className="animate-ticker flex w-max gap-4">
        {doubled.map((r, i) => {
          const meta = sentimentMeta[r.sentiment];
          const Icon = meta.icon;
          return (
            <div key={`${r.id}-${i}`} className="glass flex w-80 shrink-0 items-start gap-3 rounded-2xl p-4">
              <span
                className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{ background: `color-mix(in srgb, ${meta.color} 18%, transparent)`, color: meta.color }}
                aria-hidden="true"
              >
                <Icon size={15} />
              </span>
              <div className="min-w-0">
                <p className="line-clamp-2 text-xs leading-relaxed text-text-base">{r.text}</p>
                <p className="mt-1.5 text-[10px] tracking-wide text-muted">
                  {fintechName(r.fintech)} · {meta.label} · {Math.round(r.confidence * 100)}% confidence
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

const FEATURES = [
  {
    icon: Radar,
    title: "Live Review Collection",
    desc: "Continuously pulls the latest public customer feedback from the Google Play Store and other public sources.",
  },
  {
    icon: BrainCircuit,
    title: "Neural Sentiment Analysis",
    desc: "NLP + machine learning classify every review as positive, neutral or negative — with a confidence score.",
  },
  {
    icon: BarChart3,
    title: "Analytics Command Center",
    desc: "Trend lines, distributions and keyword intelligence rendered on a cinematic real-time dashboard.",
  },
  {
    icon: Scale,
    title: "Fintech Comparison",
    desc: "Put OPay, PalmPay, Moniepoint and FairMoney side by side and see who customers really trust.",
  },
  {
    icon: Search,
    title: "Search & Filtering",
    desc: "Slice reviews by fintech, sentiment, source or keyword to find the exact voice you need.",
  },
  {
    icon: ShieldCheck,
    title: "Admin Control",
    desc: "Trigger fresh collection runs, export results and monitor system health from the admin panel.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative z-10 mx-auto max-w-6xl scroll-mt-24 px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mb-14 text-center"
      >
        <p className="mb-3 text-xs font-semibold tracking-[0.3em] text-accent uppercase">Capabilities</p>
        <h2 className="font-display text-3xl font-bold md:text-5xl">
          An AI that <span className="text-gradient">listens to every voice</span>
        </h2>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: (i % 3) * 0.1, duration: 0.55 }}
            whileHover={{ y: -6 }}
            className="glass group rounded-2xl p-6 transition-shadow hover:glow-accent"
          >
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border-accent)] text-accent">
              <f.icon size={20} aria-hidden="true" />
            </span>
            <h3 className="font-display mb-2 text-lg font-semibold">{f.title}</h3>
            <p className="text-sm leading-relaxed text-muted">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

const STEPS = [
  { n: "01", title: "Collect", desc: "SENPAI fetches the newest public reviews for each fintech on demand." },
  { n: "02", title: "Understand", desc: "Text is cleaned, tokenized and passed through the neural sentiment engine." },
  { n: "03", title: "Reveal", desc: "Insights land on your dashboard — trends, comparisons and keywords, live." },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative z-10 mx-auto max-w-5xl scroll-mt-24 px-4 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <p className="mb-3 text-xs font-semibold tracking-[0.3em] text-accent uppercase">Protocol</p>
        <h2 className="font-display text-3xl font-bold md:text-5xl">How SENPAI works</h2>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.12, duration: 0.55 }}
            className="glass relative overflow-hidden rounded-2xl p-6"
          >
            <span className="font-display text-gradient text-4xl font-bold">{s.n}</span>
            <h3 className="font-display mb-1.5 mt-4 text-lg font-semibold">{s.title}</h3>
            <p className="text-sm leading-relaxed text-muted">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function CTA() {
  return (
    <section className="relative z-10 mx-auto max-w-4xl px-4 pb-28">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="glass-strong glow-ring relative overflow-hidden rounded-3xl p-10 text-center md:p-14"
      >
        <div className="scanline" aria-hidden="true" />
        <h2 className="font-display text-3xl font-bold md:text-4xl">
          Turning public voices into <span className="text-gradient">intelligent decisions</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted md:text-base">
          Step into the command center and watch Nigeria&apos;s fintech sentiment
          unfold in real time.
        </p>
        <Link
          href="/dashboard"
          className="glow-accent group mt-8 inline-flex cursor-pointer items-center gap-2 rounded-xl px-7 py-3.5 font-semibold text-[var(--bg)] transition-transform hover:scale-[1.04] active:scale-95"
          style={{ background: "linear-gradient(120deg, var(--accent), var(--accent-2))" }}
        >
          Launch SENPAI
          <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </motion.div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-[var(--border)] px-4 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-xs text-muted md:flex-row">
        <p className="font-display tracking-widest">SENPAI</p>
        <p>Sentiment Engine for Neural Public Analytics &amp; Insights</p>
        <p>Final-year project · {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
