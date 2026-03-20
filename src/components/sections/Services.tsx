"use client";

import { useTranslations } from "next-intl";
import SectionTitle from "@/components/ui/SectionTitle";
import ServiceCard from "@/components/ui/ServiceCard";
import { motion } from "framer-motion";

interface ServiceItem {
  title: string;
  description: string;
  icon: string;
}

export default function Services() {
  const t = useTranslations("services");

  const items = t.raw("items") as ServiceItem[];

  return (
    <section
      id="services"
      className="section-padding relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #0a0a0a 0%, #0d1a0f 50%, #0a0a0a 100%)",
      }}
    >
      <div className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(34,197,94,0.8) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-150 h-75 bg-green-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionTitle
          title={t("sectionTitle")}
          subtitle={t("sectionSubtitle")}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <ServiceCard
              key={i}
              title={item.title}
              description={item.description}
              icon={item.icon}
              index={i}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-white/40 text-sm mb-4">
            Ready to elevate your performance?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              const el = document.getElementById("contact");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-green-500 to-emerald-600 text-black font-bold text-sm tracking-wide"
          >
            Get In Touch
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}