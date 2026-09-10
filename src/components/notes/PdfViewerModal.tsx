"use client";

import React, { useState } from "react";
import { X, ExternalLink, Download, Maximize2, Minimize2, Sparkles } from "lucide-react";
import { getGoogleDriveEmbedUrl, getGoogleDriveDownloadUrl } from "@/lib/drive";

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  driveUrl: string;
  category: string;
}

export function PdfViewerModal({
  isOpen,
  onClose,
  title,
  driveUrl,
  category,
}: PdfViewerModalProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);

  if (!isOpen) return null;

  const embedUrl = getGoogleDriveEmbedUrl(driveUrl);
  const downloadUrl = getGoogleDriveDownloadUrl(driveUrl);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full rounded-3xl border border-slate-200 dark:border-slate-800 bg-[#0c121e] shadow-2xl flex flex-col transition-all duration-300 overflow-hidden ${
          isFullScreen
            ? "h-[98vh] max-w-[98vw]"
            : "h-[85vh] max-w-5xl"
        }`}
      >
        {/* Top Action Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/90 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-2.5 truncate mr-4">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 whitespace-nowrap">
              {category}
            </span>
            <h3 className="text-sm sm:text-base font-extrabold text-white truncate">
              {title}
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Direct Open in Drive */}
            <a
              href={driveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Open directly in Google Drive"
            >
              <span>Google Drive</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Direct Download */}
            <a
              href={downloadUrl || driveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm shadow-cyan-500/20"
              title="Download PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </a>

            {/* Toggle Full Screen */}
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullScreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Embedded Iframe Container */}
        <div className="relative flex-1 w-full bg-slate-950">
          <iframe
            src={embedUrl}
            title={title}
            className="w-full h-full border-0"
            allow="autoplay"
          />
        </div>
      </div>
    </div>
  );
}
