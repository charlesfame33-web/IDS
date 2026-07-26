"use client";

import { motion } from "framer-motion";
import { Cpu } from "lucide-react";

/** Placeholder panel for modules arriving in the next build phase. */
export function ModuleOnline({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-strong glow-ring relative w-full max-w-lg overflow-hidden rounded-3xl p-10 text-center"
      >
        <div className="scanline" aria-hidden="true" />
        <span className="glow-accent mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--border-accent)] text-accent">
          <Cpu size={26} aria-hidden="true" />
        </span>
        <h1 className="font-display text-2xl font-bold">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">{desc}</p>
        <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--surface)] px-4 py-1.5 text-xs tracking-widest text-accent uppercase">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
          Module initializing — next build phase
        </p>
      </motion.div>
    </div>
  );
}
