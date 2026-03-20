"use client";

import { useTranslations } from "next-intl";
import SectionTitle from "@/components/ui/SectionTitle";
import TimelineItem from "@/components/ui/TimelineItem";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";

interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
}

export default function Experience() {
  const t = useTranslations("experience");
  const items = t.raw("items") as ExperienceItem[];

  return (
    <section
      id="experience"
      className="section-padding bg-neutral-950 relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-green-500/3 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/4 right-0 w-48 h-48 bg-emerald-600/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title={t("sectionTitle")}
          subtitle={t("sectionSubtitle")}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3 hidden lg:block sticky top-28"
          >
            <div className="rounded-2xl border border-white/8 bg-white/3 p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
                <Briefcase size={22} className="text-green-400" />
              </div>
              <p className="font-oswald text-lg font-bold text-white tracking-wide mb-1">
                Career Path
              </p>
              <p className="text-white/40 text-xs leading-relaxed">
                From Tunisia to Spain — building expertise across elite sport environments.
              </p>

              <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
                {items.map((item, i) => (
                  <div key={i} className="text-left">
                    <p className="text-white/70 text-xs font-semibold">
                      {item.company}
                    </p>
                    <p className="text-white/30 text-xs">{item.period}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="lg:col-span-9">
            {items.map((item, i) => (
              <TimelineItem
                key={i}
                role={item.role}
                company={item.company}
                period={item.period}
                location={item.location}
                description={item.description}
                index={i}
                isLast={i === items.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}