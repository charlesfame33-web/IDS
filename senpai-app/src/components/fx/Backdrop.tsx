"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";

/** Drifting particle field, colored by the active theme's accent. */
function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const accent = getComputedStyle(document.documentElement)
      .getPropertyValue("--accent")
      .trim();

    const COUNT = 70;
    const dots = Array.from({ length: COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -(Math.random() * 0.35 + 0.08),
      a: Math.random() * 0.5 + 0.15,
    }));

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = accent;
      for (const d of dots) {
        ctx.globalAlpha = d.a;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
        d.x += d.vx;
        d.y += d.vy;
        if (d.y < -4) {
          d.y = height + 4;
          d.x = Math.random() * width;
        }
        if (d.x < -4) d.x = width + 4;
        if (d.x > width + 4) d.x = -4;
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    if (reduced) {
      // Static single frame for reduced-motion users
      ctx.fillStyle = accent;
      for (const d of dots) {
        ctx.globalAlpha = d.a;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    } else {
      raf = requestAnimationFrame(draw);
    }

    const onResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}

/** Soft glow that trails the mouse — cinematic HUD feel. */
function MouseGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 3;
    let tx = x;
    let ty = y;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const loop = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      el.style.transform = `translate(${x - 250}px, ${y - 250}px)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-0 h-[500px] w-[500px] rounded-full opacity-[0.12] blur-3xl transition-colors duration-700"
      style={{ background: "var(--accent)" }}
    />
  );
}

/** Full cinematic background stack: gradient, aurora blobs, grid, particles, mouse glow. */
export function Backdrop() {
  return (
    <>
      <MouseGlow />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div
          className="absolute inset-0 transition-colors duration-700"
          style={{
            background:
              "radial-gradient(ellipse 90% 65% at 50% -10%, var(--bg-2), var(--bg) 70%)",
          }}
        />
        <div className="aurora aurora-1 left-[8%] top-[6%] h-[420px] w-[420px]" />
        <div className="aurora aurora-2 right-[6%] top-[28%] h-[380px] w-[380px]" />
        <div className="grid-overlay absolute inset-0" />
        <Particles />
      </div>
    </>
  );
}
