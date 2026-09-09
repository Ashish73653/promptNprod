import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SearchProvider } from "@/components/providers/SearchContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchModal } from "@/components/search/SearchModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Prompt N Prod | From Prompt to Production",
    template: "%s | Prompt N Prod",
  },
  description:
    "The high-velocity developer intelligence platform. Track breaking tech developments, master structured engineering roadmaps, build real AI projects, and laugh at dev culture.",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [
      { url: "/apple-touch-icon.png" },
    ],
  },
  manifest: "/site.webmanifest",
  keywords: [
    "AI Engineering",
    "Model Context Protocol",
    "Next.js 16",
    "React 19",
    "Full-Stack Roadmaps",
    "Software Architecture",
    "DeepSeek R1",
    "Agentic Workflows",
  ],
  authors: [{ name: "Prompt N Prod Editorial Team" }],
  creator: "Prompt N Prod",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://promptnprod.dev",
    title: "Prompt N Prod | From Prompt to Production",
    description:
      "The high-velocity developer discovery platform: What's New, Curated Roadmaps, Production Blueprints, and Dev Memes.",
    siteName: "Prompt N Prod",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prompt N Prod | From Prompt to Production",
    description:
      "The high-velocity developer discovery platform: What's New, Curated Roadmaps, Production Blueprints, and Dev Memes.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#07090e" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#f8fafc] dark:bg-[#07090e] text-slate-900 dark:text-slate-100 font-sans selection:bg-cyan-500/20 selection:text-cyan-500 bg-dev-grid">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <SearchProvider>
            <div id="top" className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <SearchModal />
          </SearchProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
