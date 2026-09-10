"use client";

import React from "react";
import { Download } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface NoteDownloadButtonProps {
  slug: string;
  title: string;
  downloadUrl: string;
}

export function NoteDownloadButton({
  slug,
  title,
  downloadUrl,
}: NoteDownloadButtonProps) {
  const handleClick = () => {
    trackEvent("note_download", {
      slug,
      title,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <a
      href={downloadUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-cyan-500/20 transition-all cursor-pointer hover:shadow-cyan-500/30"
    >
      <Download className="w-4 h-4" />
      <span>Download PDF</span>
    </a>
  );
}
