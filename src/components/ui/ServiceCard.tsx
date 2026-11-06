"use client";

import { motion } from "framer-motion";
import { Dumbbell, Trophy, Activity } from "lucide-react";
import SpotlightCard from "@/components/ui/SpotlightCard";

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

export default function ServiceCard({ title, description, icon, index }: ServiceCardProps) {
  const Icon = iconMap[icon] ?? Activity;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      whileHover={{ y: -6 }}
      className="h-full"
    >
      <SpotlightCard as="article" className="h-full p-8 backdrop-blur-sm" glow="rgba(34,197,94,0.18)">
        <div aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-transparent via-green-500/70 to-transparent opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100" />

        <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-green-500/25 bg-linear-to-br from-green-500/20 to-emerald-600/10 transition-transform duration-300 group-hover/spot:scale-110">
          <Icon size={24} className="text-green-400" aria-hidden />
        </span>

        <span aria-hidden className="absolute right-6 top-6 select-none font-oswald text-6xl font-bold text-white/4 transition-colors duration-300 group-hover/spot:text-green-500/10">
          0{index + 1}
        </span>

        <h3 className="mb-3 font-oswald text-xl font-bold tracking-wide text-white transition-colors duration-300 group-hover/spot:text-green-300">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-white/65 transition-colors duration-300 group-hover/spot:text-white/80">
          {description}
        </p>
      </SpotlightCard>
    </motion.div>
  );
}
