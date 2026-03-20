"use client";

import { motion } from "framer-motion";
import { Dumbbell, Trophy, Activity } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: string;
  index: number;
}

const iconMap: Record<string, React.ElementType> = {
  dumbbell: Dumbbell,
  trophy: Trophy,
  activity: Activity,
};

export default function ServiceCard({
  title,
  description,
  icon,
  index,
}: ServiceCardProps) {
  const Icon = iconMap[icon] ?? Activity;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      whileHover={{ y: -8 }}
      className="group relative rounded-2xl border border-white/8 bg-white/3 backdrop-blur-sm p-8 overflow-hidden cursor-default"
    >
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-linear-to-br from-green-500/5 to-emerald-600/5 border border-green-500/20" />

      <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-green-500/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-green-500/20 to-emerald-600/10 border border-green-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <Icon size={24} className="text-green-400" />
        </div>

        <span className="absolute top-8 right-8 font-oswald text-6xl font-bold text-white/3 group-hover:text-white/5 transition-colors duration-300 select-none">
          0{index + 1}
        </span>

        <h3 className="font-oswald text-xl font-bold text-white mb-3 tracking-wide group-hover:text-green-400 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-white/60 text-sm leading-relaxed group-hover:text-white/80 transition-colors duration-300">
          {description}
        </p>
      </div>
    </motion.div>
  );
}