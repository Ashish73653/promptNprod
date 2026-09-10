"use client";

import React, { useState } from "react";
import { 
  X, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  BookOpen, 
  ThumbsUp, 
  HelpCircle 
} from "lucide-react";
import { NoteRequestDb } from "@/db";

interface RequestNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestSubmitted?: (newRequest: NoteRequestDb) => void;
}

export function RequestNoteModal({
  isOpen,
  onClose,
  onRequestSubmitted,
}: RequestNoteModalProps) {
  const [topic, setTopic] = useState("");
  const [categoryChoice, setCategoryChoice] = useState("AWS & Cloud");
  const [customCategory, setCustomCategory] = useState("");
  const [details, setDetails] = useState("");
  const [userContact, setUserContact] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!topic.trim()) {
      setError("Please specify the topic or cheatsheet you want.");
      return;
    }

    const finalCategory =
      categoryChoice === "CUSTOM"
        ? customCategory.trim() || "General"
        : categoryChoice;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/note-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          category: finalCategory,
          details: details.trim() || null,
          userContact: userContact.trim() || null,
        }),
      });

      const data = await res.json();

      if (data.success && data.request) {
        setIsSuccess(true);
        if (onRequestSubmitted) {
          onRequestSubmitted(data.request);
        }
        setTimeout(() => {
          setIsSuccess(false);
          setTopic("");
          setDetails("");
          setUserContact("");
          setCustomCategory("");
          onClose();
        }, 2000);
      } else {
        setError(data.message || "Failed to submit request.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#0d131f] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Request a Study Note or Cheatsheet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                We create and publish community-requested guides every week.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {isSuccess ? (
            <div className="py-10 text-center space-y-3 animate-in zoom-in-90">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                Request Logged in Neon DB!
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Thank you! Your topic has been queued for our editorial team. You can view and upvote it in the Community Requests section.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Topic / Exam Title *
                </label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Kubernetes CKA Architecture or Redis Caching Patterns"
                  className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Discipline
                  </label>
                  <select
                    value={categoryChoice}
                    onChange={(e) => setCategoryChoice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="AWS & Cloud">☁️ AWS &amp; Cloud</option>
                    <option value="DBMS & Systems">🗄️ DBMS &amp; Systems</option>
                    <option value="SQL Cheatsheets">⚡ SQL Cheatsheets</option>
                    <option value="AI & Agents">🤖 AI &amp; Agents</option>
                    <option value="DevOps & Containers">🐳 DevOps &amp; Containers</option>
                    <option value="System Design">📐 System Design</option>
                    <option value="CUSTOM">➕ Other / Custom</option>
                  </select>
                </div>

                {categoryChoice === "CUSTOM" && (
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-cyan-500 block mb-1">
                      Custom Category Name
                    </label>
                    <input
                      type="text"
                      required
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="e.g. Linux Kernel"
                      className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm border border-cyan-500/40 bg-cyan-500/5 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Specific Details / Pain Points (Optional)
                </label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="What specific concepts, diagrams, or certification objectives do you struggle with?"
                  className="w-full px-4 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 resize-none transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Your Handle / Email (Optional)
                </label>
                <input
                  type="text"
                  value={userContact}
                  onChange={(e) => setUserContact(e.target.value)}
                  placeholder="@username or email so we can notify you"
                  className="w-full px-4 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-cyan-500/20 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
