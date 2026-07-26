"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Palette, X, Check } from "lucide-react";
import { THEMES } from "@/lib/themes";
import { useTheme } from "./ThemeProvider";

/**
 * Floating Theme Hub — opens a panel of 7 glowing theme cards.
 * Switching a theme re-paints the entire app via CSS variables.
 */
export function ThemeHub() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="glass-strong glow-ring absolute bottom-16 right-0 w-72 rounded-2xl p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="font-display text-sm font-bold tracking-wide">
                  THEME ENGINE
                </p>
                <p className="text-xs text-muted">Choose your suit</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close theme hub"
                className="cursor-pointer rounded-lg p-1.5 text-muted transition-colors hover:text-text-base"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {THEMES.map((t, i) => {
                const active = t.id === theme;
                return (
                  <motion.button
                    key={t.id}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => setTheme(t.id)}
                    aria-label={`Switch to ${t.codename} theme`}
                    className={`group flex cursor-pointer items-center gap-3 rounded-xl border p-2.5 text-left transition-all duration-300 ${
                      active
                        ? "glow-accent border-[var(--border-accent)] bg-[var(--surface)]"
                        : "border-transparent hover:border-[var(--border)] hover:bg-[var(--surface)]"
                    }`}
                  >
                    <span className="flex shrink-0 -space-x-1.5">
                      {t.swatches.map((c) => (
                        <span
                          key={c}
                          className="h-5 w-5 rounded-full border border-white/20"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold">
                        {t.codename}
                      </span>
                      <span className="block truncate text-xs text-muted">
                        {t.vibe}
                      </span>
                    </span>
                    {active && <Check size={16} className="text-accent" />}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen((v) => !v)}
        aria-label="Open theme engine"
        className="glass-strong glow-accent flex h-13 w-13 cursor-pointer items-center justify-center rounded-full border border-[var(--border-accent)] p-3.5 text-accent"
      >
        <Palette size={22} />
      </motion.button>
    </div>
  );
}
