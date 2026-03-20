"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { GraduationCap, Target, Rocket } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";

const icons = [GraduationCap, Target, Rocket];
const keys = ["academic", "coaching", "vision"] as const;

const cardColors = [
  "from-blue-500/10 to-blue-600/5 border-blue-500/20 hover:border-blue-500/40",
  "from-green-500/10 to-emerald-600/5 border-green-500/20 hover:border-green-500/40",
  "from-purple-500/10 to-purple-600/5 border-purple-500/20 hover:border-purple-500/40",
];

const iconColors = [
  "text-blue-400 bg-blue-500/10 border-blue-500/20",
  "text-green-400 bg-green-500/10 border-green-500/20",
  "text-purple-400 bg-purple-500/10 border-purple-500/20",
];

export default function About() {
  const t = useTranslations("about");

  return (
    <section id="about" className="section-padding bg-neutral-950 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title={t("sectionTitle")}
          subtitle={t("sectionSubtitle")}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {keys.map((key, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                whileHover={{ y: -6 }}
                className={`group relative rounded-2xl border bg-linear-to-br p-8 transition-all duration-300 cursor-default ${cardColors[i]}`}
              >
                <div
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 ${iconColors[i]}`}
                >
                  <Icon size={22} />
                </div>

                <h3 className="font-oswald text-xl font-bold text-white mb-3 tracking-wide">
                  {t(`${key}.title`)}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {t(`${key}.body`)}
                </p>

                <span className="absolute bottom-6 right-6 font-oswald text-5xl font-bold text-white/3 select-none">
                  0{i + 1}
                </span>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 rounded-2xl border border-white/8 bg-white/3 px-8 py-6 flex flex-col md:flex-row items-center gap-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-green-400 to-emerald-600 flex items-center justify-center font-oswald text-2xl font-bold text-black shrink-0">
            KB
          </div>

          <div className="flex-1 text-center md:text-left">
            <p className="font-oswald text-lg font-bold text-white tracking-wide">
              Karim Boudabous
            </p>
            <p className="text-white/50 text-sm mt-0.5">
              MSc High Performance S&C · UEFA C Candidate · Personal Trainer · UCAM
            </p>
          </div>

          <div className="flex items-center gap-6">
            {[
              { label: "Murcia", sublabel: "Spain" },
              { label: "UCAM", sublabel: "Graduate" },
              { label: "Basic-Fit", sublabel: "Trainer" },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <p className="font-oswald text-base font-bold text-green-400">
                  {item.label}
                </p>
                <p className="text-white/30 text-xs">{item.sublabel}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}