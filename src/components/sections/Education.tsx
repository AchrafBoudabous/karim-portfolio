"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { GraduationCap, Award, BookOpen, School } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";

interface EducationItem {
  degree: string;
  institution: string;
  year: string;
  description: string;
}

const icons = [GraduationCap, Award, BookOpen, School];

const cardStyles = [
  {
    border: "border-green-500/20 hover:border-green-500/40",
    glow: "bg-green-500/3",
    icon: "text-green-400 bg-green-500/10 border-green-500/20",
    badge: "bg-green-500/10 text-green-400 border-green-500/20",
    accent: "from-green-500/0 via-green-500/50 to-green-500/0",
  },
  {
    border: "border-yellow-500/20 hover:border-yellow-500/40",
    glow: "bg-yellow-500/3",
    icon: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    badge: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    accent: "from-yellow-500/0 via-yellow-500/50 to-yellow-500/0",
  },
  {
    border: "border-blue-500/20 hover:border-blue-500/40",
    glow: "bg-blue-500/3",
    icon: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    accent: "from-blue-500/0 via-blue-500/50 to-blue-500/0",
  },
  {
    border: "border-purple-500/20 hover:border-purple-500/40",
    glow: "bg-purple-500/3",
    icon: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    badge: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    accent: "from-purple-500/0 via-purple-500/50 to-purple-500/0",
  },
];

export default function Education() {
  const t = useTranslations("education");
  const items = t.raw("items") as EducationItem[];

  return (
    <section
      id="education"
      className="section-padding relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #0a0a0a 0%, #0d1a0f 50%, #0a0a0a 100%)",
      }}
    >
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-green-500/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionTitle
          title={t("sectionTitle")}
          subtitle={t("sectionSubtitle")}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {items.slice(0, 2).map((item, i) => {
            const Icon = icons[i];
            const style = cardStyles[i];

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                whileHover={{ y: -6 }}
                className={`group relative rounded-2xl border ${style.border} ${style.glow} bg-white/3 p-8 transition-all duration-300 overflow-hidden cursor-default`}
              >
                <div
                  className={`absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r ${style.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                <div
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-6 ${style.icon} group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon size={22} />
                </div>

                <span
                  className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border mb-4 ${style.badge}`}
                >
                  {item.year}
                </span>

                <h3 className="font-oswald text-lg font-bold text-white tracking-wide mb-2 leading-tight">
                  {item.degree}
                </h3>

                <p className="text-white/50 text-xs font-medium mb-4 uppercase tracking-wider">
                  {item.institution}
                </p>

                <p className="text-white/55 text-sm leading-relaxed">
                  {item.description}
                </p>

                <span className="absolute bottom-4 right-4 font-oswald text-6xl font-bold text-white/3 select-none">
                  0{i + 1}
                </span>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.slice(2, 4).map((item, i) => {
            const actualIndex = i + 2;
            const Icon = icons[actualIndex];
            const style = cardStyles[actualIndex];

            return (
              <motion.div
                key={actualIndex}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                whileHover={{ y: -6 }}
                className={`group relative rounded-2xl border ${style.border} ${style.glow} bg-white/3 p-8 transition-all duration-300 overflow-hidden cursor-default`}
              >
                <div
                  className={`absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r ${style.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                <div
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-6 ${style.icon} group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon size={22} />
                </div>

                <span
                  className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border mb-4 ${style.badge}`}
                >
                  {item.year}
                </span>

                <h3 className="font-oswald text-lg font-bold text-white tracking-wide mb-2 leading-tight">
                  {item.degree}
                </h3>

                <p className="text-white/50 text-xs font-medium mb-4 uppercase tracking-wider">
                  {item.institution}
                </p>

                <p className="text-white/55 text-sm leading-relaxed">
                  {item.description}
                </p>

                <span className="absolute bottom-4 right-4 font-oswald text-6xl font-bold text-white/3 select-none">
                  0{actualIndex + 1}
                </span>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 rounded-2xl border border-white/8 bg-white/3 px-8 py-6"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-oswald text-lg font-bold text-white tracking-wide mb-1">
                Key Skills & Certifications
              </p>
              <p className="text-white/40 text-sm">
                Internationally recognized qualifications in sport science and coaching.
              </p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-end gap-3">
              {[
                "UEFA C Candidate",
                "MSc S&C",
                "BSc Sport Science",
                "CPR Certified",
                "Sports Nutrition",
                "Load Management",
              ].map((cert, i) => (
                <span
                  key={i}
                  className="px-4 py-2 rounded-xl border border-green-500/20 bg-green-500/5 text-green-400 text-xs font-semibold tracking-wide"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}