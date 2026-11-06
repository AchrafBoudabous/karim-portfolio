"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  subtitle: string;
  centered?: boolean;
}

/** Eyebrow label + headline whose last word gets the brand gradient. */
export default function SectionTitle({ title, subtitle, centered = true }: SectionTitleProps) {
  const words = subtitle.trim().split(/\s+/);
  const last = words.pop();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn("mb-14", centered ? "text-center" : "text-left")}
    >
      <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-500/25 bg-green-500/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-green-400">
        <span aria-hidden className="h-1 w-1 rounded-full bg-green-400" />
        {title}
      </p>
      <h2 className="font-oswald text-3xl font-bold tracking-tight text-white text-balance md:text-4xl lg:text-5xl">
        {words.length > 0 && `${words.join(" ")} `}
        <span className="gradient-text">{last}</span>
      </h2>
      <motion.div
        aria-hidden
        initial={{ width: 0 }}
        whileInView={{ width: 64 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className={cn("mt-5 h-0.5 rounded-full bg-linear-to-r from-green-400 to-emerald-600", centered && "mx-auto")}
      />
    </motion.div>
  );
}
