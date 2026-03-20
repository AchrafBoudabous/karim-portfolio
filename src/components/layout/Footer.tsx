"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Instagram, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="relative border-t border-white/5 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-green-400 to-emerald-600 flex items-center justify-center font-oswald font-bold text-black">
              KB
            </div>
            <div>
              <p className="font-oswald font-bold text-white tracking-wide">
                KARIM BOUDABOUS
              </p>
              <p className="text-xs text-white/40">{t("madeWith")}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {[
              {
                icon: Linkedin,
                href: "https://linkedin.com/in/karim-boudabous-a389902b3/",
                label: "LinkedIn",
              },
              {
                icon: Instagram,
                href: "https://instagram.com/karim_boudabous",
                label: "Instagram",
              },
              {
                icon: Mail,
                href: "mailto:karimboudabous04@gmail.com",
                label: "Email",
              },
            ].map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/50 hover:text-green-400 hover:border-green-500/40 hover:bg-green-500/10 transition-colors duration-200"
                aria-label={label}
              >
                <Icon size={16} />
              </motion.a>
            ))}
          </div>

          <p className="text-xs text-white/30 text-center md:text-right">
            © {new Date().getFullYear()} Karim Boudabous.{" "}
            <br className="sm:hidden" />
            {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}