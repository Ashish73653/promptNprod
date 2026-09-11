"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Send, CheckCircle2, ArrowUpRight } from "lucide-react";
import { GithubIcon, TwitterIcon, InstagramIcon } from "../ui/Icons";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      // Ignore
    } finally {
      setLoading(false);
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#080c14] mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow-md flex items-center justify-center">
                <Image src="/Logo.png" alt="Prompt N Prod" fill className="object-contain p-0.5" sizes="32px" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                Prompt<span className="text-cyan-500">N</span>Prod
              </span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              The high-velocity developer discovery platform. Visual study notes, interactive roadmaps, and real-world engineering insights — all in one place.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                Stay ahead — get weekly developer insights
              </span>
              {subscribed ? (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4" /> You&apos;re in! We&apos;ll keep you ahead of the curve.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex items-center gap-2 max-w-sm">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email..."
                    className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 disabled:opacity-60 text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 shrink-0 transition-colors shadow-sm shadow-cyan-500/20"
                  >
                    <span>Subscribe</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Nav Pillars */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/feed" className="text-slate-600 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
                  Tech News
                </Link>
              </li>
              <li>
                <Link href="/notes" className="text-slate-600 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
                  Study Notes &amp; PDFs
                </Link>
              </li>
              <li>
                <Link href="/roadmaps" className="text-slate-600 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
                  Roadmaps &amp; Projects
                </Link>
              </li>
              <li>
                <Link href="/memes" className="text-slate-600 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
                  Dev Memes
                </Link>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/promptnprod"
                  target="_blank"
                  rel="noreferrer"
                  className="text-pink-500 hover:underline transition-colors flex items-center gap-1"
                >
                  <span>@promptnprod Reels</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Featured Tracks + Social */}
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-4">
                Featured Tracks
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="/roadmaps/full-stack-ai-engineer" className="text-slate-600 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
                    Full-Stack AI Engineer
                  </Link>
                </li>
                <li>
                  <Link href="/roadmaps/nextjs-modern-fullstack" className="text-slate-600 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
                    Next.js 16 Mastery
                  </Link>
                </li>
                <li>
                  <Link href="/roadmaps/agentic-systems-architect" className="text-slate-600 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
                    Agentic Systems &amp; MCP
                  </Link>
                </li>
                <li>
                  <Link href="/roadmaps/cloud-native-production-hardening" className="text-slate-600 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
                    Cloud &amp; DevOps
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social icons */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
                Connect
              </h4>
              <div className="flex items-center gap-2">
                <a
                  href="https://www.instagram.com/promptnprod"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram @promptnprod"
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-pink-500 hover:border-pink-500/40 transition-colors"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-cyan-500 transition-colors"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Twitter / X"
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-cyan-500 transition-colors"
                >
                  <TwitterIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} Prompt N Prod. Built with Next.js &amp; Neon PostgreSQL.</p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-cyan-500 hover:underline transition-colors">
              About
            </Link>
            <Link href="/roadmaps" className="hover:text-cyan-500 hover:underline transition-colors">
              Roadmaps
            </Link>
            <a href="#top" className="hover:underline">
              Back to top ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
