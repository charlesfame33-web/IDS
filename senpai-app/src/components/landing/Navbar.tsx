"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BrainCircuit, LayoutDashboard } from "lucide-react";

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4"
    >
      <nav className="glass-strong mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-5 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="glow-accent flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-accent)] text-accent">
            <BrainCircuit size={20} />
          </span>
          <span className="font-display text-lg font-bold tracking-widest">
            SENPAI
          </span>
        </Link>

        <div className="hidden items-center gap-6 text-sm text-muted md:flex">
          <a href="#features" className="cursor-pointer transition-colors hover:text-text-base">
            Features
          </a>
          <a href="#fintechs" className="cursor-pointer transition-colors hover:text-text-base">
            Fintechs
          </a>
          <a href="#how" className="cursor-pointer transition-colors hover:text-text-base">
            How it works
          </a>
        </div>

        <Link
          href="/dashboard"
          className="glow-accent flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--border-accent)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-accent transition-transform hover:scale-[1.03] active:scale-95"
        >
          <LayoutDashboard size={16} />
          <span className="hidden sm:inline">Launch Dashboard</span>
          <span className="sm:hidden">Dashboard</span>
        </Link>
      </nav>
    </motion.header>
  );
}
