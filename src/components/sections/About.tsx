"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { GraduationCap, Target, Rocket } from "lucide-react";
import Image from "next/image";
import SectionTitle from "@/components/ui/SectionTitle";
import SpotlightCard from "@/components/ui/SpotlightCard";

const PILLARS = [
  { key: "academic", icon: GraduationCap },
  { key: "coaching", icon: Target },
  { key: "vision", icon: Rocket },
] as const;

interface Highlight {
  label: string;
  sublabel: string;
}

export default function About() {
  const t = useTranslations("about");
  const highlights = t.raw("highlights") as Highlight[];

  return (
    <section id="about" className="section-padding relative overflow-hidden bg-neutral-950">
      <div aria-hidden className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-green-500/5 blur-3xl" />

      <div className="mx-auto max-w-7xl">
        <SectionTitle title={t("sectionTitle")} subtitle={t("sectionSubtitle")} />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto -mt-4 mb-14 max-w-3xl text-center text-base leading-relaxed text-white/70 md:text-lg"
        >
          {t("intro")}
        </motion.p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {PILLARS.map(({ key, icon: Icon }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="h-full"
            >
              <SpotlightCard className="h-full p-8">
                <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-green-500/25 bg-green-500/10 text-green-400 transition-transform duration-300 group-hover/spot:scale-110 group-hover/spot:rotate-3">
                  <Icon size={22} aria-hidden />
                </span>
                <h3 className="mb-3 font-oswald text-xl font-bold tracking-wide text-white">
                  {t(`${key}.title`)}
                </h3>
                <p className="text-sm leading-relaxed text-white/65">{t(`${key}.body`)}</p>
                <span aria-hidden className="absolute bottom-0 right-2 select-none font-oswald text-7xl font-bold text-white/4">
                  0{i + 1}
                </span>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col items-center gap-6 rounded-2xl border border-white/10 bg-white/3 px-6 py-6 md:flex-row md:px-8"
        >
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-green-500/30 ring-4 ring-green-500/10">
            <Image
              src="/images/Coaching/CDE FUENLABRADA ATLANTIS/Under 19/WhatsApp Image 2026-11-06 at 10.45.04 (3).jpeg"
              alt=""
              fill
              sizes="160px"
              className="scale-[2.4] object-cover object-[49%_44%]"
            />
          </div>

          <p className="flex-1 text-center font-oswald text-xl font-bold tracking-wide text-white md:text-left">
            Karim Boudabous
          </p>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-5">
            {highlights.map((item) => (
              <div key={item.label} className="flex flex-col-reverse text-center">
                <dt className="text-xs text-white/55">{item.sublabel}</dt>
                <dd className="font-oswald text-base font-bold text-green-400">{item.label}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>
  );
}
