"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Award,
  BookOpen,
  Star,
  Zap,
  Clock,
  Dumbbell,
  ShieldPlus,
  type LucideIcon,
} from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import SpotlightCard from "@/components/ui/SpotlightCard";
import Marquee from "@/components/ui/Marquee";
import { cn } from "@/lib/utils";

interface EducationItem {
  degree: string;
  institution: string;
  year: string;
  description: string;
  inProgress?: boolean;
}

const ICONS = {
  uefa: Award,
  fifa: ShieldPlus,
  nsca: Dumbbell,
  tactics: Star,
  barca: Zap,
  master: BookOpen,
  progress: Clock,
  degree: GraduationCap,
} satisfies Record<string, LucideIcon>;

// Picked by keyword so the icon follows the credential, not its position.
function iconKey(item: EducationItem): keyof typeof ICONS {
  const d = `${item.degree} ${item.institution}`.toLowerCase();
  if (d.includes("uefa")) return "uefa";
  if (d.includes("fifa")) return "fifa";
  if (d.includes("nsca") || d.includes("cscs")) return "nsca";
  if (d.includes("scout") || d.includes("tácti") || d.includes("tacti")) return "tactics";
  if (d.includes("barça")) return "barca";
  if (d.includes("master") || d.includes("máster")) return "master";
  if (item.inProgress) return "progress";
  return "degree";
}

function EducationCard({ item, delay }: { item: EducationItem; delay: number }) {
  const Icon = ICONS[iconKey(item)];
  const progress = Boolean(item.inProgress);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay }}
      className="h-full"
    >
      <SpotlightCard
        as="article"
        className={cn("h-full p-7", progress && "border-dashed border-yellow-500/25 hover:border-yellow-500/45")}
        glow={progress ? "rgba(234,179,8,0.12)" : undefined}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <span
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-transform duration-300 group-hover/spot:scale-110",
              progress
                ? "border-yellow-500/25 bg-yellow-500/10 text-yellow-400"
                : "border-green-500/25 bg-green-500/10 text-green-400"
            )}
          >
            <Icon size={22} aria-hidden />
          </span>
          <span
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-semibold",
              progress
                ? "border-yellow-500/25 bg-yellow-500/10 text-yellow-300"
                : "border-green-500/25 bg-green-500/10 text-green-300"
            )}
          >
            {item.year}
          </span>
        </div>
        <h3 className="mb-2 font-oswald text-lg font-bold leading-tight tracking-wide text-white">
          {item.degree}
        </h3>
        <p className="mb-4 text-xs font-medium uppercase tracking-wider text-white/55">{item.institution}</p>
        <p className="text-sm leading-relaxed text-white/65">{item.description}</p>
      </SpotlightCard>
    </motion.div>
  );
}

export default function Education() {
  const t = useTranslations("education");
  const items = t.raw("items") as EducationItem[];
  const skills = t.raw("skills") as string[];

  const done = items.filter((i) => !i.inProgress);
  const inProgress = items.filter((i) => i.inProgress);
  const degrees = done.slice(0, 2);
  const certificates = done.slice(2);

  return (
    <section
      id="education"
      className="section-padding relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0a0a0a 0%, #0c1a10 50%, #0a0a0a 100%)" }}
    >
      <div aria-hidden className="pointer-events-none absolute right-1/4 top-0 h-96 w-96 rounded-full bg-green-500/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <SectionTitle title={t("sectionTitle")} subtitle={t("sectionSubtitle")} />

        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {degrees.map((item, i) => (
            <EducationCard key={item.degree} item={item} delay={i * 0.12} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {certificates.map((item, i) => (
            <EducationCard key={item.degree} item={item} delay={i * 0.1} />
          ))}
        </div>

        {inProgress.length > 0 && (
          <>
            <div className="mb-6 mt-12 flex items-center gap-4">
              <span className="shrink-0 rounded-full border border-yellow-500/25 bg-yellow-500/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-yellow-300">
                {t("inProgressLabel")}
              </span>
              <span aria-hidden className="h-px flex-1 bg-white/10" />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {inProgress.map((item, i) => (
                <EducationCard key={item.degree} item={item} delay={i * 0.12} />
              ))}
            </div>
          </>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-white/3 py-6"
        >
          <div className="mb-5 px-6 text-center md:px-8">
            <p className="mb-1 font-oswald text-lg font-bold tracking-wide text-white">{t("skillsTitle")}</p>
            <p className="text-sm text-white/60">{t("skillsSubtitle")}</p>
          </div>
          <Marquee duration="30s" gap="0.75rem">
            {skills.map((skill) => (
              <span
                key={skill}
                className="whitespace-nowrap rounded-xl border border-green-500/25 bg-green-500/5 px-4 py-2 text-xs font-semibold tracking-wide text-green-300"
              >
                {skill}
              </span>
            ))}
          </Marquee>
        </motion.div>
      </div>
    </section>
  );
}
