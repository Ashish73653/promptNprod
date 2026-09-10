"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Lock, 
  Plus, 
  Trash2, 
  ExternalLink, 
  FileText, 
  Sparkles, 
  AlertCircle, 
  Loader2, 
  ArrowLeft,
  CheckCircle2,
  FolderPlus,
  MessageSquarePlus,
  ThumbsUp,
  Clock,
  ArrowUpRight,
  Send,
  Eye
} from "lucide-react";
import { StudyNoteDb, NoteRequestDb } from "@/db";

export default function AdminNotesPage() {
  const [adminKey, setAdminKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<"published" | "requests">("published");

  // Data
  const [notes, setNotes] = useState<StudyNoteDb[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [requests, setRequests] = useState<NoteRequestDb[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successNotice, setSuccessNotice] = useState("");

  // Form Fields
  const [title, setTitle] = useState("");
  const [categoryChoice, setCategoryChoice] = useState("AWS & Cloud");
  const [customCategory, setCustomCategory] = useState("");
  const [driveUrl, setDriveUrl] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [pagesCount, setPagesCount] = useState("");
  const [fileSize, setFileSize] = useState("");

  // Restore stored admin key
  useEffect(() => {
    try {
      const savedKey = sessionStorage.getItem("pnp_admin_key");
      if (savedKey) {
        setAdminKey(savedKey);
        setIsAuthenticated(true);
      }
    } catch {
      // Ignore
    }
  }, []);

  const fetchNotes = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/notes");
      const data = await res.json();
      if (data.success && Array.isArray(data.notes)) {
        setNotes(data.notes);
        if (data.categories) {
          setCategories(data.categories.filter((c: string) => c !== "All"));
        }
      }
    } catch (err) {
      console.error("Failed to load notes:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchRequests = useCallback(async () => {
    try {
      const res = await fetch("/api/note-requests?limit=100");
      const data = await res.json();
      if (data.success && Array.isArray(data.requests)) {
        setRequests(data.requests);
      }
    } catch (err) {
      console.error("Failed to load requests:", err);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotes();
      fetchRequests();
    }
  }, [isAuthenticated, fetchNotes, fetchRequests]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey.trim()) {
      setError("Please enter your admin secret key.");
      return;
    }

    try {
      sessionStorage.setItem("pnp_admin_key", adminKey.trim());
    } catch {
      // Ignore
    }

    setIsAuthenticated(true);
    setError("");
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessNotice("");

    const finalCategory =
      categoryChoice === "NEW" ? customCategory.trim() : categoryChoice.trim();

    if (!title.trim() || !finalCategory || !driveUrl.trim() || !description.trim()) {
      setError("Please fill out Title, Category, Google Drive Link, and Description.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey.trim(),
        },
        body: JSON.stringify({
          title: title.trim(),
          category: finalCategory,
          driveUrl: driveUrl.trim(),
          description: description.trim(),
          tags: tags.trim(),
          pagesCount: pagesCount ? parseInt(pagesCount, 10) : null,
          fileSize: fileSize.trim() || "PDF",
        }),
      });

      const data = await res.json();

      if (res.status === 401) {
        setError("Invalid Admin Secret Key! Please check your credentials in .env.local.");
        setIsAuthenticated(false);
        return;
      }

      if (data.success && data.note) {
        setSuccessNotice(`Successfully published: "${data.note.title}" to Neon DB!`);
        // Reset form
        setTitle("");
        setDriveUrl("");
        setDescription("");
        setTags("");
        setPagesCount("");
        setFileSize("");
        setCustomCategory("");
        setCategoryChoice(finalCategory);
        fetchNotes();
        setTimeout(() => setSuccessNotice(""), 5000);
      } else {
        setError(data.message || "Failed to publish note.");
      }
    } catch (err) {
      console.error("Publish error:", err);
      setError("Network error while connecting to database.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNote = async (id: number, noteTitle: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${noteTitle}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/notes?id=${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-key": adminKey.trim(),
        },
      });

      const data = await res.json();
      if (data.success) {
        setNotes((prev) => prev.filter((n) => n.id !== id));
        setSuccessNotice(`Deleted "${noteTitle}".`);
        setTimeout(() => setSuccessNotice(""), 4000);
      } else {
        alert(data.message || "Could not delete note.");
      }
    } catch {
      alert("Failed to delete note.");
    }
  };

  // Pre-fill form from community request
  const handleFulfillRequest = (req: NoteRequestDb) => {
    setTitle(req.topic);
    if (["AWS & Cloud", "DBMS & Systems", "SQL Cheatsheets", "AI & Agents"].includes(req.category)) {
      setCategoryChoice(req.category);
      setCustomCategory("");
    } else {
      setCategoryChoice("NEW");
      setCustomCategory(req.category);
    }
    setDescription(req.details || `Curated revision notes covering ${req.topic}.`);
    setTags(req.category);
    setActiveTab("published");
    setSuccessNotice(`Pre-filled form with requested topic: "${req.topic}". Add the Google Drive link and publish!`);
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  const handleUpdateRequestStatus = async (id: number, newStatus: string) => {
    try {
      const res = await fetch("/api/note-requests", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey.trim(),
        },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
        );
        setSuccessNotice(`Updated request status to ${newStatus}.`);
        setTimeout(() => setSuccessNotice(""), 3000);
      }
    } catch {
      alert("Failed to update status.");
    }
  };

  const handleDeleteRequest = async (id: number, topicName: string) => {
    if (!confirm(`Delete request "${topicName}"?`)) return;

    try {
      const res = await fetch(`/api/note-requests?id=${id}`, {
        method: "DELETE",
        headers: { "x-admin-key": adminKey.trim() },
      });
      const data = await res.json();
      if (data.success) {
        setRequests((prev) => prev.filter((r) => r.id !== id));
      }
    } catch {
      alert("Failed to delete request.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center px-4">
        <div className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-4 mx-auto border border-cyan-500/20">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-center text-slate-900 dark:text-white">
            Study Notes Admin Vault
          </h2>
          <p className="mt-2 text-xs text-center text-slate-500 dark:text-slate-400">
            Enter your secret admin key (configured in <code className="text-cyan-500">.env.local</code>) to manage notes.
          </p>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Admin Secret Key
              </label>
              <input
                type="password"
                required
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Enter secret passkey..."
                className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-sm shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Unlock Admin Panel</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  return (
    <div className="min-h-screen py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/notes"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-cyan-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Public Notes Vault</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Authenticated</span>
            </span>
            <button
              onClick={() => {
                sessionStorage.removeItem("pnp_admin_key");
                setIsAuthenticated(false);
              }}
              className="text-xs text-slate-400 hover:text-rose-500 underline"
            >
              Lock Panel
            </button>
          </div>
        </div>

        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Owner Management Studio
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Study Notes &amp; Community Requests
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Publish Google Drive study notes and view what specific cheatsheets your community is asking for.
          </p>
        </div>

        {/* Studio View Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4 mb-8">
          <button
            onClick={() => setActiveTab("published")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "published"
                ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20"
                : "bg-slate-100 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Publish &amp; Live Notes ({notes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("requests")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "requests"
                ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20"
                : "bg-slate-100 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Community Wishlist</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-pink-500 text-white font-black">
                {pendingCount}
              </span>
            )}
          </button>
        </div>

        {successNotice && (
          <div className="mb-8 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {error && (
          <div className="mb-8 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm font-semibold flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* TAB 1: PUBLISH FORM & EXISTING NOTES */}
        {activeTab === "published" && (
          <>
            {/* Publish Form */}
            <div id="publish-form" className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl mb-12">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-500" />
                <span>Publish New Study Note</span>
              </h2>

              <form onSubmit={handleCreateNote} className="space-y-5">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Note Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. AWS Solutions Architect Associate (SAA-C03) Complete Notes"
                    className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                {/* Category selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Category *
                    </label>
                    <select
                      value={categoryChoice}
                      onChange={(e) => setCategoryChoice(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="AWS & Cloud">☁️ AWS &amp; Cloud</option>
                      <option value="DBMS & Systems">🗄️ DBMS &amp; Systems</option>
                      <option value="SQL Cheatsheets">⚡ SQL Cheatsheets</option>
                      <option value="AI & Agents">🤖 AI &amp; Agents</option>
                      {categories
                        .filter((c) => !["AWS & Cloud", "DBMS & Systems", "SQL Cheatsheets", "AI & Agents"].includes(c))
                        .map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      <option value="NEW">➕ Create a New Category...</option>
                    </select>
                  </div>

                  {categoryChoice === "NEW" && (
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-cyan-500 block mb-1.5 flex items-center gap-1">
                        <FolderPlus className="w-3.5 h-3.5" /> Type New Category Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder="e.g. Computer Networks or Linux Internals"
                        className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-cyan-500/50 bg-cyan-500/5 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Google Drive Public Sharing Link *
                  </label>
                  <input
                    type="url"
                    required
                    value={driveUrl}
                    onChange={(e) => setDriveUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view?usp=sharing"
                    className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                  <p className="mt-1 text-[11px] text-slate-400">
                    Tip: In Google Drive, click Share → set to &quot;Anyone with the link can view&quot; → Copy link.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Description / Key Topics *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Core topics covered, mental models, exam tips..."
                    className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Tags (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="AWS, Cloud, VPC"
                      className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Pages Count (Optional)
                    </label>
                    <input
                      type="number"
                      value={pagesCount}
                      onChange={(e) => setPagesCount(e.target.value)}
                      placeholder="e.g. 24"
                      className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      File Size (Optional)
                    </label>
                    <input
                      type="text"
                      value={fileSize}
                      onChange={(e) => setFileSize(e.target.value)}
                      placeholder="e.g. 3.4 MB"
                      className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-cyan-500/25 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Publishing to Neon...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Publish to Website</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Notes Table */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                  Live Published Notes ({notes.length})
                </h2>
                {isLoading && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
              </div>

              {notes.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No notes found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                        <th className="pb-3 font-semibold">Title</th>
                        <th className="pb-3 font-semibold">Category</th>
                        <th className="pb-3 font-semibold">Google Drive Link</th>
                        <th className="pb-3 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {notes.map((note) => (
                        <tr key={note.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="py-3.5 pr-4 font-bold text-slate-900 dark:text-white">
                            <Link href={`/notes/${note.slug}`} className="hover:text-cyan-500 transition-colors">
                              {note.title}
                            </Link>
                          </td>
                          <td className="py-3.5 pr-4">
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 whitespace-nowrap">
                              {note.category}
                            </span>
                          </td>
                          <td className="py-3.5 pr-4">
                            <a
                              href={note.driveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-cyan-500 font-mono truncate max-w-[200px]"
                            >
                              <span>Open PDF</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </td>
                          <td className="py-3.5 text-right">
                            <button
                              onClick={() => handleDeleteNote(note.id, note.title)}
                              className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-500/10 transition-colors"
                              title="Delete note"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* TAB 2: COMMUNITY NOTE REQUESTS */}
        {activeTab === "requests" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                  User Requested Cheatsheets &amp; Notes ({requests.length})
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Click &ldquo;Fulfill &amp; Publish&rdquo; to auto-populate the note creation form with the student&apos;s requested title &amp; category.
                </p>
              </div>
            </div>

            {requests.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No user requests submitted yet.
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                          {req.category}
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            req.status === "fulfilled"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              : req.status === "in_progress"
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                              : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                          }`}
                        >
                          Status: {req.status}
                        </span>

                        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3 text-cyan-500" />
                          <span>{req.upvotes} Upvotes</span>
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {req.topic}
                      </h3>

                      {req.details && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          <strong>Details:</strong> {req.details}
                        </p>
                      )}

                      {req.userContact && (
                        <p className="text-[11px] text-slate-400 font-mono">
                          Contact / User: {req.userContact}
                        </p>
                      )}
                    </div>

                    {/* Admin Actions */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200 dark:border-slate-800">
                      {/* Fulfill Button */}
                      <button
                        onClick={() => handleFulfillRequest(req)}
                        className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                        title="Pre-fill publish form with this request"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Fulfill &amp; Publish</span>
                      </button>

                      {/* Status Toggle Dropdown */}
                      <select
                        value={req.status}
                        onChange={(e) => handleUpdateRequestStatus(req.id, e.target.value)}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="fulfilled">Fulfilled</option>
                      </select>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteRequest(req.id, req.topic)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                        title="Delete Request"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
