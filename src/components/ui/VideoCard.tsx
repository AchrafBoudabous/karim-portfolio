"use client";

import { Play } from "lucide-react";

interface VideoCardProps {
  src: string;
  title: string;
  category: string;
  onClick: () => void;
  playLabel: string;
}

/**
 * Video tile. The preview is the browser's own first frame (`#t=1.5` media
 * fragment + preload="metadata"), so only a few KB per video are fetched —
 * no canvas snapshots and no full downloads.
 */
export default function VideoCard({ src, title, category, onClick, playLabel }: VideoCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${playLabel}: ${title}`}
      className="group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 text-left transition-colors hover:border-green-500/30"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-neutral-900">
        <video
          src={`${encodeURI(src)}#t=1.5`}
          preload="metadata"
          muted
          playsInline
          tabIndex={-1}
          aria-hidden
          className="pointer-events-none h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span aria-hidden className="absolute inset-0 bg-black/30 transition-colors duration-300 group-hover:bg-black/10" />
        <span aria-hidden className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/90 shadow-2xl shadow-green-500/30 transition-all duration-200 group-hover:scale-110 group-hover:bg-green-400">
            <Play size={20} className="ml-1 text-black" fill="black" />
          </span>
        </span>
      </div>
      <div className="border-t border-white/5 px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-green-400">{category}</span>
        <p className="mt-0.5 truncate text-sm font-medium text-white/85">{title}</p>
      </div>
    </button>
  );
}
