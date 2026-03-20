"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar } from "lucide-react";

interface TimelineItemProps {
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
  index: number;
  isLast: boolean;
}

export default function TimelineItem({
  role,
  company,
  period,
  location,
  description,
  index,
  isLast,
}: TimelineItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="relative pl-12 pb-12"
    >
      {!isLast && (
        <div className="absolute left-3.75 top-8 bottom-0 w-0.5 bg-linear-to-b from-green-500/60 via-green-500/20 to-transparent" />
      )}

      <div className="absolute left-0 top-1.5 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.15 + 0.2, type: "spring" }}
          className="w-8 h-8 rounded-full bg-linear-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20 z-10"
        >
          <span className="text-black font-bold text-xs">{index + 1}</span>
        </motion.div>
      </div>

      <motion.div
        whileHover={{ x: 4 }}
        transition={{ duration: 0.2 }}
        className="group relative rounded-2xl border border-white/8 bg-white/3 p-6 hover:border-green-500/20 hover:bg-green-500/3 transition-all duration-300"
      >
        <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl bg-linear-to-r from-green-500/0 via-green-500/40 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
          <div>
            <h3 className="font-oswald text-xl font-bold text-white tracking-wide group-hover:text-green-400 transition-colors duration-300">
              {role}
            </h3>
            <p className="text-green-400/80 font-semibold text-sm mt-0.5">
              {company}
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
            <div className="flex items-center gap-1.5 text-white/40 text-xs">
              <Calendar size={11} />
              <span>{period}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/40 text-xs">
              <MapPin size={11} />
              <span>{location}</span>
            </div>
          </div>
        </div>

        <p className="text-white/55 text-sm leading-relaxed">{description}</p>
      </motion.div>
    </motion.div>
  );
}