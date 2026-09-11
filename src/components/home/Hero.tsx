"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  Code2,
  Zap,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useSearch } from "../providers/SearchContext";

/* ── Typewriter helper ── */
const WORDS = ["Production.", "Impact.", "Scale.", "The Future."];

function useTypewriter() {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = WORDS[wordIdx];
    let delay = deleting ? 55 : 100;

    if (!deleting && charIdx === word.length) {
      delay = 1800; // pause at full word
    } else if (deleting && charIdx === 0) {
      delay = 300;
      setDeleting(false);
      setWordIdx((i) => (i + 1) % WORDS.length);
      return;
    }

    const timer = setTimeout(() => {
      if (!deleting && charIdx < word.length) {
        setDisplay(word.slice(0, charIdx + 1));
        setCharIdx((c) => c + 1);
      } else if (deleting) {
        setDisplay(word.slice(0, charIdx - 1));
        setCharIdx((c) => c - 1);
      } else {
        setDeleting(true);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [charIdx, deleting, wordIdx]);

  return display;
}

/* ── Canvas particle field ── */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let W = 0;
    let H = 0;

    const PARTICLE_COUNT = 60;
    interface Particle {
      x: number; y: number;
      vx: number; vy: number;
      r: number;
      alpha: number;
      color: string;
    }

    const COLORS = ["#06b6d4", "#6366f1", "#a855f7", "#3b82f6", "#22d3ee"];
    let particles: Particle[] = [];

    function resize() {
      W = canvas!.offsetWidth;
      H = canvas!.offsetHeight;
      canvas!.width = W;
      canvas!.height = H;
    }

    function init() {
      resize();
      particles = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.15,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H);

      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx!.beginPath();
            ctx!.strokeStyle = `rgba(99,102,241,${0.07 * (1 - dist / 130)})`;
            ctx!.lineWidth = 0.6;
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        // Glow
        const grad = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
        grad.addColorStop(0, p.color + "cc");
        grad.addColorStop(1, p.color + "00");
        ctx!.fillStyle = grad;
        ctx!.globalAlpha = p.alpha;
        ctx!.fill();
        ctx!.globalAlpha = 1;

        // Update
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      });

      animId = requestAnimationFrame(draw);
    }

    init();
    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none -z-10"
      style={{ opacity: 0.6 }}
    />
  );
}

/* ── Stats with animated counter ── */
function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        let start = 0;
        const step = Math.ceil(target / 40);
        const id = setInterval(() => {
          start += step;
          if (start >= target) { setVal(target); clearInterval(id); }
          else setVal(start);
        }, 30);
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <div ref={ref}>{val}{suffix}</div>;
}

/* ── Main component ── */
export function Hero() {
  const { openSearch } = useSearch();
  const word = useTypewriter();

  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 min-h-[85vh] flex flex-col justify-center">

      {/* ── Canvas particle network ── */}
      <ParticleCanvas />

      {/* ── Breathing gradient orbs ── */}
      <div
        className="animate-glow-breathe pointer-events-none absolute left-1/2 top-1/4 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at 40% 50%, rgba(6,182,212,0.28) 0%, rgba(99,102,241,0.15) 40%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="animate-glow-breathe-2 pointer-events-none absolute right-1/4 top-2/3 -z-10 h-[400px] w-[500px] -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(168,85,247,0.2) 0%, rgba(236,72,153,0.1) 50%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />
      {/* Bottom ambient */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-[180px] w-[700px] -translate-x-1/2 opacity-50"
        style={{
          background: "radial-gradient(ellipse at center, rgba(6,182,212,0.2) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* ── Grid overlay ── */}
      <div className="bg-dev-grid absolute inset-0 -z-10 opacity-100" />

      {/* ── Floating geometric accents ── */}
      <div className="animate-float-a pointer-events-none absolute left-[5%] top-[18%] -z-10 h-32 w-32 rounded-2xl border border-cyan-500/10 rotate-12 opacity-50" />
      <div className="animate-float-b pointer-events-none absolute right-[6%] top-[22%] -z-10 h-20 w-20 rounded-full border border-indigo-500/15 opacity-40" />
      <div className="animate-float-c pointer-events-none absolute right-[15%] bottom-[20%] -z-10 h-14 w-14 rounded-xl border border-purple-500/10 rotate-45 opacity-30" />
      <div className="animate-float-a pointer-events-none absolute left-[18%] bottom-[12%] -z-10 h-8 w-8 rounded-full bg-cyan-500/8 opacity-60" style={{ animationDelay: "3s" }} />

      {/* ── CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Badge */}
        <div className="animate-hero-badge inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/8 dark:bg-cyan-500/12 text-cyan-700 dark:text-cyan-300 text-xs font-semibold mb-8 shadow-sm shadow-cyan-500/10 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
          <span>Developer Intelligence Hub — Visual Notes, Roadmaps &amp; Live Tech Radar</span>
          <span className="relative flex h-2 w-2">
            <span className="badge-dot-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="animate-hero-title text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-5xl mx-auto leading-[1.08]">
          From{" "}
          <span className="text-gradient-animated">Prompt</span>
          {" "}to{" "}
          <br className="hidden sm:block" />
          {/* Typewriter word */}
          <span className="inline-block min-w-[5ch] text-gradient-animated">
            {word}
            <span className="animate-pulse text-cyan-400">|</span>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="animate-hero-sub mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          The high-velocity developer discovery platform. Cut through AI noise with
          editorial signal, master structured engineering roadmaps, and ship production software.
        </p>

        {/* CTA Buttons */}
        <div className="animate-hero-cta mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {/* Primary — gradient with animated border shimmer */}
          <Link
            href="/notes"
            className="group relative px-7 py-3.5 rounded-xl overflow-hidden font-semibold text-sm sm:text-base flex items-center gap-2 text-white shadow-xl shadow-rose-500/20 transition-all hover:scale-[1.04] hover:shadow-rose-500/40 active:scale-[0.97]"
            style={{
              background: "linear-gradient(135deg, #f43f5e 0%, #e11d48 35%, #fb923c 100%)",
            }}
          >
            {/* Shimmer overlay */}
            <span
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background: "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.22) 50%, transparent 80%)",
              }}
            />
            <Sparkles className="w-4 h-4 relative z-10" />
            <span className="relative z-10">Visual Study Notes</span>
            <ArrowRight className="w-4 h-4 relative z-10 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>

          {/* Secondary */}
          <Link
            href="/roadmaps"
            className="group relative px-7 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 hover:border-cyan-500/50 dark:hover:border-cyan-400/50 text-slate-900 dark:text-white font-semibold text-sm sm:text-base flex items-center gap-2 transition-all hover:scale-[1.03] hover:shadow-lg hover:shadow-cyan-500/10 active:scale-[0.97] backdrop-blur-md"
          >
            {/* Glow on hover */}
            <span className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ boxShadow: "inset 0 0 20px rgba(6,182,212,0.06)" }}
            />
            <BookOpen className="w-4 h-4 text-cyan-500 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-[-5deg]" />
            <span>Interactive Roadmaps</span>
          </Link>

          {/* Search trigger */}
          <button
            type="button"
            onClick={openSearch}
            className="group px-5 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/60 hover:border-cyan-500/40 hover:bg-white dark:hover:bg-slate-800/80 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-sm flex items-center gap-2 transition-all cursor-pointer"
          >
            <Search className="w-4 h-4 transition-transform duration-200 group-hover:scale-105" />
            <span>Quick Search</span>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 font-mono">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* ── Social proof strip ── */}
        <div
          className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10"
          style={{ animation: "hero-fade-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.75s both" }}
        >
          {[
            { icon: "🌐", text: "Next.js 16 App Router" },
            { icon: "⚡", text: "Vercel Edge Network" },
            { icon: "🗄️", text: "Neon PostgreSQL" },
            { icon: "✉️", text: "Resend Notifications" },
          ].map(({ icon, text }) => (
            <span key={text} className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              <span>{icon}</span>
              <span>{text}</span>
            </span>
          ))}
        </div>

        {/* ── STAT BAR with animated counters ── */}
        <div
          className="mt-14 sm:mt-16 pt-10 border-t border-slate-200/60 dark:border-slate-800/60 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto"
          style={{ animation: "hero-fade-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.65s both" }}
        >
          <div className="stat-delay-0 group space-y-1 cursor-default">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white transition-transform duration-200 group-hover:scale-105">
              <AnimatedNumber target={60} suffix="fps" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" /> GPU-Only Animations
            </p>
          </div>

          <div className="stat-delay-1 group space-y-1 cursor-default">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white transition-transform duration-200 group-hover:scale-105">
              <AnimatedNumber target={10} suffix="+" />
              <span className="text-cyan-500"> Tracks</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-blue-500" /> Curated Roadmaps
            </p>
          </div>

          <div className="stat-delay-2 group space-y-1 cursor-default">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white transition-transform duration-200 group-hover:scale-105">
              <AnimatedNumber target={100} suffix="%" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
              <Code2 className="w-3.5 h-3.5 text-purple-500" /> Open &amp; Free Content
            </p>
          </div>

          <div className="stat-delay-3 group space-y-1 cursor-default">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white transition-transform duration-200 group-hover:scale-105">
              &lt;<AnimatedNumber target={50} suffix="ms" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Global Edge TTFB
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
