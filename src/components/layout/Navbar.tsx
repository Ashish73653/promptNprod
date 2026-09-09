"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  Zap, 
  Search, 
  Menu, 
  X, 
  Sparkles, 
  BookOpen, 
  Code2, 
  Laugh, 
  CheckCircle2, 
  Compass,
  SlidersHorizontal
} from "lucide-react";
import { GithubIcon, InstagramIcon } from "../ui/Icons";
import { ThemeToggle } from "../ui/ThemeToggle";
import { useSearch } from "../providers/SearchContext";

const navLinks = [
  { name: "What's New", href: "/feed", icon: Sparkles },
  { name: "Learn", href: "/learn", icon: BookOpen },
  { name: "Build", href: "/build", icon: Code2 },
  { name: "Scorecard", href: "/scorecard", icon: SlidersHorizontal },
  { name: "Memes", href: "/memes", icon: Laugh },
  { name: "About", href: "/about", icon: Compass },
];

export function Navbar() {
  const pathname = usePathname();
  const { openSearch } = useSearch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        scrolled
          ? "glass shadow-md shadow-black/5"
          : "bg-transparent border-b border-slate-200/50 dark:border-slate-800/40"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center bg-slate-900 border border-slate-800 shadow-md group-hover:scale-105 transition-transform">
              <Image src="/Logo.png" alt="Prompt N Prod" fill className="object-contain p-0.5" priority sizes="36px" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                  Prompt<span className="text-cyan-500">N</span>Prod
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 border border-cyan-500/20">
                  V2
                </span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 -mt-1 hidden sm:block">
                From Prompt to Production
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 dark:bg-cyan-500/15"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right actions: Search, Theme, Github */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search Button */}
            <button
              onClick={openSearch}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 hover:border-cyan-500/40 hover:text-slate-900 dark:hover:text-white transition-all text-xs sm:text-sm"
              aria-label="Open search dialog"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-500 dark:text-slate-400">
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Instagram external link */}
            <a
              href="https://www.instagram.com/promptnprod"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram @promptnprod"
              title="@promptnprod on Instagram"
              className="hidden sm:flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-pink-500 hover:border-pink-500/40 transition-colors"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>

            {/* GitHub external link */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub Repository"
              className="hidden sm:flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <GithubIcon className="w-4 h-4" />
            </a>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0c121e]/95 backdrop-blur-xl px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-2 duration-150">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                  isActive
                    ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-semibold"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
              >
                <Icon className="w-4 h-4 text-cyan-500" />
                <span>{link.name}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between px-2">
            <span className="text-xs text-slate-500 font-medium">Prompt N Prod</span>
            <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> Production Ready
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
