"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BrainCircuit,
  LayoutDashboard,
  BarChart3,
  TrendingUp,
  Scale,
  Sparkles,
  Settings,
  Home,
} from "lucide-react";
import { Backdrop } from "@/components/fx/Backdrop";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/trends", label: "Trends", icon: TrendingUp },
  { href: "/dashboard/compare", label: "Compare", icon: Scale },
  { href: "/dashboard/insights", label: "AI Insights", icon: Sparkles },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="relative flex min-h-dvh">
      <Backdrop />

      {/* Sidebar */}
      <aside className="glass-strong fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-[var(--border)] p-4 lg:flex">
        <Link href="/" className="mb-8 flex items-center gap-2.5 px-2 pt-1">
          <span className="glow-accent flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-accent)] text-accent">
            <BrainCircuit size={20} />
          </span>
          <span className="font-display text-lg font-bold tracking-widest">SENPAI</span>
        </Link>

        <nav className="flex flex-1 flex-col gap-1" aria-label="Dashboard navigation">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "glow-accent border border-[var(--border-accent)] bg-[var(--surface)] text-accent"
                    : "border border-transparent text-muted hover:bg-[var(--surface)] hover:text-text-base"
                }`}
              >
                <item.icon size={17} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/"
          className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted transition-colors hover:bg-[var(--surface)] hover:text-text-base"
        >
          <Home size={17} aria-hidden="true" />
          Back to site
        </Link>
      </aside>

      {/* Mobile top nav */}
      <header className="glass-strong fixed inset-x-0 top-0 z-40 flex items-center justify-between px-4 py-3 lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-accent)] text-accent">
            <BrainCircuit size={17} />
          </span>
          <span className="font-display font-bold tracking-widest">SENPAI</span>
        </Link>
        <nav className="flex gap-1" aria-label="Dashboard navigation">
          {NAV.slice(0, 4).map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
                className={`cursor-pointer rounded-lg p-2.5 transition-colors ${
                  active ? "bg-[var(--surface)] text-accent" : "text-muted"
                }`}
              >
                <item.icon size={18} />
              </Link>
            );
          })}
        </nav>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 px-4 pb-16 pt-20 lg:ml-60 lg:px-8 lg:pt-8">
        {children}
      </main>
    </div>
  );
}
