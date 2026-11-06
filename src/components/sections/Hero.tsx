"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, CalendarDays, GraduationCap, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Button, { buttonClasses, Shine } from "@/components/ui/Button";
import NumberTicker from "@/components/ui/NumberTicker";
import { useBooking } from "@/components/booking/BookingProvider";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
});

export default function Hero() {
  const t = useTranslations("hero");
  const tBooking = useTranslations("booking");
  const tAbout = useTranslations("about");
  const { openBooking } = useBooking();
  const currentRole = (tAbout.raw("highlights") as { sublabel: string }[])[2]?.sublabel;
  const roles = t("subtitle").split("|").map((r) => r.trim()).filter(Boolean);

  return (
    <section className="relative flex min-h-svh items-center overflow-hidden pt-24 pb-16 md:pt-28">
      {/* Background */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-neutral-950">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,197,94,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.6) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse at 60% 40%, black 20%, transparent 70%)",
          }}
        />
        <div className="absolute -top-40 right-0 h-152 w-152 rounded-full bg-green-500/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-emerald-600/10 blur-[120px]" />
        <div className="noise absolute inset-0 opacity-[0.035] mix-blend-overlay" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 md:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        {/* Copy */}
        <div className="text-center lg:text-left">
          <motion.p
            {...fadeUp(0.1)}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-green-500/25 bg-green-500/5 px-4 py-2 text-xs font-medium text-green-300 sm:text-sm"
          >
            <span className="relative flex h-2 w-2" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
            </span>
            {t("badge")}
          </motion.p>

          <motion.h1
            {...fadeUp(0.2)}
            className="font-oswald text-5xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-7xl lg:text-8xl"
          >
            {t("title").split(" ").map((word, i) => (
              <span key={i} className={i === 0 ? "block" : "block gradient-text"}>
                {word}
              </span>
            ))}
          </motion.h1>

          <motion.ul
            {...fadeUp(0.35)}
            className="mt-7 flex flex-wrap justify-center gap-2 lg:justify-start"
            aria-label={t("subtitle")}
          >
            {roles.map((role) => (
              <li
                key={role}
                className="rounded-full border border-white/10 bg-white/4 px-3 py-1.5 text-xs font-medium text-white/75 backdrop-blur-sm sm:text-sm"
              >
                {role}
              </li>
            ))}
          </motion.ul>

          <motion.p
            {...fadeUp(0.45)}
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/65 md:text-lg lg:mx-0"
          >
            {t("tagline")}
          </motion.p>

          <motion.div
            {...fadeUp(0.55)}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >
            <Button size="lg" onClick={openBooking} shine className="w-full sm:w-auto">
              <CalendarDays size={16} aria-hidden />
              {tBooking("title")}
            </Button>
            <a href="#about" className={buttonClasses({ variant: "secondary", size: "lg", className: "group w-full sm:w-auto" })}>
              {t("cta")}
              <ArrowRight size={16} aria-hidden className="transition-transform group-hover:translate-x-1" />
            </a>
          </motion.div>

          <motion.dl
            {...fadeUp(0.7)}
            className="mx-auto mt-12 grid max-w-lg grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/3 backdrop-blur-sm lg:mx-0"
          >
            {[
              { value: <NumberTicker value={2} suffix="+" />, label: t("statsExperienceLabel") },
              { value: "MSc", label: t("statsMscLabel") },
              { value: "UEFA C", label: t("statsUefaLabel") },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col-reverse px-3 py-4 text-center">
                <dt className="mt-1 text-[11px] leading-tight tracking-wide text-white/55 sm:text-xs">{stat.label}</dt>
                <dd className="font-oswald text-2xl font-bold text-green-400 sm:text-3xl">{stat.value}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* Portrait */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-sm sm:max-w-md lg:max-w-none"
        >
          <div aria-hidden className="absolute -inset-4 rounded-4xl bg-linear-to-br from-green-500/25 via-transparent to-emerald-600/20 blur-2xl" />
          <div className="relative aspect-4/5 overflow-hidden rounded-[1.75rem] border border-white/10 bg-neutral-900 shadow-2xl shadow-black/60">
            <Image
              src="/images/Wallpaper.jpeg"
              alt="Karim Boudabous"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 40vw"
              className="object-cover object-[50%_45%]"
            />
            <div aria-hidden className="absolute inset-0 bg-linear-to-t from-neutral-950/80 via-transparent to-transparent" />
            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl border border-white/10 bg-neutral-950/70 px-4 py-3 backdrop-blur-md">
              <div>
                <p className="font-oswald text-sm font-bold tracking-wide text-white">CDE Fuenlabrada Atlantis</p>
                <p className="text-xs text-white/60">Madrid</p>
              </div>
              <span className="relative overflow-hidden rounded-full bg-green-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-black">
                <Shine />
                <span className="relative">{currentRole}</span>
              </span>
            </div>
          </div>

          {/* Floating credential chips */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="absolute -left-4 top-10 hidden items-center gap-2 rounded-xl border border-white/10 bg-neutral-900/85 px-3 py-2 shadow-xl backdrop-blur-md sm:flex lg:-left-10"
          >
            <ShieldCheck size={16} className="text-green-400" aria-hidden />
            <span className="text-xs font-semibold text-white">UEFA C Licence</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.05, duration: 0.6 }}
            className="absolute -right-4 top-1/2 hidden items-center gap-2 rounded-xl border border-white/10 bg-neutral-900/85 px-3 py-2 shadow-xl backdrop-blur-md sm:flex lg:-right-8"
          >
            <GraduationCap size={16} className="text-green-400" aria-hidden />
            <span className="text-xs font-semibold text-white">MSc Strength & Conditioning</span>
          </motion.div>
        </motion.div>
      </div>

      <a
        href="#about"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/50 transition-colors duration-200 hover:text-green-400 md:flex"
      >
        <span className="text-[11px] uppercase tracking-[0.3em]">{t("scroll")}</span>
        <ArrowDown size={16} className="animate-bounce" aria-hidden />
      </a>
    </section>
  );
}
