"use client";

import React, { useState } from "react";
import { 
  Send, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  BellRing,
  ShieldCheck
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface NewsletterBoxProps {
  source?: string;
  title?: string;
  subtitle?: string;
}

export function NewsletterBox({
  source = "general",
  title = "Get New Study Notes & Roadmaps In Your Inbox",
  subtitle = "Zero spam. Just high-signal AWS, DBMS, SQL, and AI architecture cheatsheets as soon as they drop.",
}: NewsletterBoxProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!email.trim() || !email.includes("@")) {
      setMessage("Please enter a valid email address.");
      setIsSuccess(false);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source }),
      });

      const data = await res.json();

      if (data.success) {
        setIsSuccess(true);
        setMessage(data.message || "You're subscribed!");
        trackEvent("newsletter_signup", { source, email });
        setEmail("");
        setTimeout(() => {
          setMessage("");
        }, 6000);
      } else {
        setIsSuccess(false);
        setMessage(data.message || "Subscription failed.");
      }
    } catch {
      setIsSuccess(false);
      setMessage("Connection error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-[#0d1322] dark:via-[#0a0e1a] dark:to-[#070a13] p-8 sm:p-10 shadow-xl">
      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-500/15 via-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-pink-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-3.5">
          <BellRing className="w-3.5 h-3.5" />
          <span>Never Miss A Revision Cheatsheet</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
          {title}
        </h3>

        <p className="mt-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg mx-auto">
          {subtitle}
        </p>

        {/* Subscription Form */}
        <form onSubmit={handleSubmit} className="mt-6 max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 p-1.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-inner">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your developer email..."
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Subscribe</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Message Banner */}
        {message && (
          <div
            className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold animate-in fade-in ${
              isSuccess
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
            }`}
          >
            {isSuccess ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{message}</span>
          </div>
        )}

        <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-500" /> No spam ever
          </span>
          <span>•</span>
          <span>1-click unsubscribe</span>
        </div>
      </div>
    </div>
  );
}
