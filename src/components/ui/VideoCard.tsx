"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface VideoCardProps {
  src: string;
  thumbnail?: string;
  title: string;
  category: string;
  onClick: () => void;
  index: number;
  playLabel: string;
}

function AutoThumbnail({ src }: { src: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    const video = document.createElement("video");
    video.src = src;
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.playsInline = true;
    video.currentTime = 1.5;

    video.addEventListener("seeked", () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      setDataUrl(canvas.toDataURL("image/jpeg"));
    });

    video.load();
  }, [src]);

  return (
    <>
      <canvas ref={canvasRef} className="hidden" />
      {dataUrl ? (
        <Image
          src={dataUrl}
          alt="Video thumbnail"
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-neutral-800 to-neutral-900 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-green-500/30 border-t-green-400 animate-spin" />
        </div>
      )}
    </>
  );
}

export default function VideoCard({
  src,
  thumbnail,
  title,
  category,
  onClick,
  index,
  playLabel,
}: VideoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onClick={onClick}
      className="group relative rounded-2xl overflow-hidden border border-white/8 bg-neutral-900 cursor-pointer"
      whileHover={{ scale: 1.02 }}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-neutral-900">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <AutoThumbnail src={src} />
        )}

        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300" />

        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-14 h-14 rounded-full bg-green-500/90 backdrop-blur-sm flex items-center justify-center shadow-2xl shadow-green-500/30 group-hover:bg-green-400 transition-colors duration-200"
          >
            <Play size={20} className="text-black ml-1" fill="black" />
          </motion.div>
        </div>

        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="text-white/80 text-xs font-medium bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg">
            {playLabel}
          </span>
        </div>
      </div>

      <div className="px-4 py-3 border-t border-white/5">
        <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">
          {category}
        </span>
        <p className="text-white/80 text-sm font-medium mt-0.5 truncate">
          {title}
        </p>
      </div>
    </motion.div>
  );
}