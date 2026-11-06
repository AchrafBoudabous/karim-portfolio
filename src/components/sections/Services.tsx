"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { CalendarDays, MessageSquare } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import ServiceCard from "@/components/ui/ServiceCard";
import Button, { buttonClasses } from "@/components/ui/Button";
import { useBooking } from "@/components/booking/BookingProvider";

interface ServiceItem {
  title: string;
  description: string;
  icon: string;
}

export default function Services() {
  const t = useTranslations("services");
  const { openBooking } = useBooking();
  const items = t.raw("items") as ServiceItem[];

  return (
    <section
      id="services"
      className="section-padding relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0a0a0a 0%, #0c1a10 50%, #0a0a0a 100%)" }}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(34,197,94,0.9) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-144 -translate-x-1/2 rounded-full bg-green-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <SectionTitle title={t("sectionTitle")} subtitle={t("sectionSubtitle")} />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((item, i) => (
            <ServiceCard key={item.title} {...item} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-14 flex flex-col items-center gap-4 text-center"
        >
          <p className="text-sm text-white/60">{t("readyCta")}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={openBooking} shine>
              <CalendarDays size={16} aria-hidden />
              {t("bookSession")}
            </Button>
            <a href="#contact" className={buttonClasses({ variant: "secondary" })}>
              <MessageSquare size={16} aria-hidden />
              {t("getInTouch")}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
