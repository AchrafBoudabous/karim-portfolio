"use client";

import { motion } from "framer-motion";

interface SectionTitleProps {
  title: string;
  subtitle: string;
  light?: boolean;
  centered?: boolean;
}

export default function SectionTitle({
  title,
  subtitle,
  light = false,
  centered = true,
}: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className={`mb-14 ${centered ? "text-center" : "text-left"}`}
    >
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="inline-block text-xs font-semibold tracking-[0.25em] uppercase text-green-400 mb-3 px-3 py-1 rounded-full border border-green-500/20 bg-green-500/5"
      >
        {title}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={`font-oswald text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight ${
          light ? "text-white" : "text-white"
        }`}
      >
        {subtitle.split(" ").map((word, i) => (
          <span key={i}>
            {i === subtitle.split(" ").length - 1 ? (
              <span className="gradient-text">{word}</span>
            ) : (
              word + " "
            )}
          </span>
        ))}
      </motion.h2>
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: centered ? "60px" : "60px" }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className={`h-0.5 bg-linear-to-r from-green-400 to-emerald-600 mt-4 rounded-full ${
          centered ? "mx-auto" : ""
        }`}
      />
    </motion.div>
  );
}