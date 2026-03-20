"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const languages = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const current = languages.find((l) => l.code === locale) ?? languages[0];

  const handleSwitch = (code: string) => {
    const segments = pathname.split("/");
    segments[1] = code;
    router.push(segments.join("/"));
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-green-500/50 transition-all duration-200 text-sm font-medium"
        aria-label="Switch language"
      >
        <Globe size={14} className="text-green-400" />
        <span>{current.flag}</span>
        <span className="hidden sm:inline text-white/80">{current.label}</span>
        <ChevronDown
          size={14}
          className={`text-white/50 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 z-50 min-w-35 rounded-xl border border-white/10 bg-neutral-900/95 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden"
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSwitch(lang.code)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors duration-150 hover:bg-green-500/10 hover:text-green-400 ${
                    lang.code === locale
                      ? "bg-green-500/10 text-green-400 font-semibold"
                      : "text-white/70"
                  }`}
                >
                  <span className="text-base">{lang.flag}</span>
                  <span>{lang.label}</span>
                  {lang.code === locale && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}