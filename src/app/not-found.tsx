import React from "react";
import Link from "next/link";
import { Home, BookOpen, Map, Zap, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center relative overflow-hidden">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full -z-10"
        style={{
          background: "radial-gradient(ellipse at center, rgba(6,182,212,0.12) 0%, rgba(99,102,241,0.08) 50%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* 404 big number */}
      <div className="relative mb-6 select-none">
        <span
          className="text-[10rem] sm:text-[14rem] font-black leading-none"
          style={{
            background: "linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(99,102,241,0.1) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-[10rem] sm:text-[14rem] font-black leading-none"
            style={{
              background: "linear-gradient(135deg, #06b6d4 0%, #6366f1 50%, #a855f7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "blur(0px)",
              opacity: 0.15,
            }}
          >
            404
          </span>
        </div>
      </div>

      {/* Message */}
      <div className="max-w-md space-y-3 mb-10">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Page not found
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist, was moved, or is still being written. Try exploring one of the sections below.
        </p>
      </div>

      {/* Quick nav cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xl mb-10">
        {[
          { label: "Home", href: "/", icon: Home, color: "text-cyan-500" },
          { label: "Study Notes", href: "/notes", icon: BookOpen, color: "text-pink-500" },
          { label: "Roadmaps", href: "/roadmaps", icon: Map, color: "text-indigo-500" },
          { label: "Tech News", href: "/feed", icon: Zap, color: "text-amber-500" },
        ].map(({ label, href, icon: Icon, color }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col items-center gap-2 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/5 transition-all backdrop-blur-sm"
          >
            <Icon className={`w-5 h-5 ${color} transition-transform duration-200 group-hover:scale-110`} />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{label}</span>
          </Link>
        ))}
      </div>

      {/* Back home primary button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 hover:opacity-90 hover:scale-[1.02] transition-all"
      >
        <Home className="w-4 h-4" />
        Back to Home
      </Link>
    </div>
  );
}
