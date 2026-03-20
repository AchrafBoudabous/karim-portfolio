"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";

const navLinks = [
  { key: "about", href: "#about" },
  { key: "services", href: "#services" },
  { key: "experience", href: "#experience" },
  { key: "gallery", href: "#gallery" },
  { key: "education", href: "#education" },
  { key: "contact", href: "#contact" },
];

export default function Navbar() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = [...navLinks].reverse();
      for (const link of sections) {
        const el = document.getElementById(link.key);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(link.key);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const headerClass = scrolled
    ? "bg-neutral-950/90 backdrop-blur-xl border-b border-white/5 shadow-xl shadow-black/20"
    : "bg-transparent";

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerClass}`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-green-400 to-emerald-600 flex items-center justify-center font-bold text-black text-sm">
              KB
            </div>
            <span className="font-bold text-lg tracking-wide hidden sm:block">
              <span className="text-white">KARIM</span>
              <span className="text-green-400"> B.</span>
            </span>
          </button>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.key}
                onClick={() => handleNavClick(link.href)}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg hover:text-green-400 ${
                  activeSection === link.key ? "text-green-400" : "text-white/70"
                }`}
              >
                {t(link.key as "about" | "services" | "experience" | "gallery" | "education" | "contact")}
                {activeSection === link.key && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-green-500/10 rounded-lg border border-green-500/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute right-0 top-0 bottom-0 w-72 bg-neutral-950 border-l border-white/10 flex flex-col pt-20 pb-8 px-6">
              <nav className="flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.button
                    key={link.key}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleNavClick(link.href)}
                    className={`text-left px-4 py-3 rounded-xl text-base font-medium transition-colors duration-200 ${
                      activeSection === link.key
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {t(link.key as "about" | "services" | "experience" | "gallery" | "education" | "contact")}
                  </motion.button>
                ))}
              </nav>
              <div className="mt-auto pt-6 border-t border-white/10">
                <p className="text-xs text-white/30 mb-4 uppercase tracking-widest">
                  Language
                </p>
                <LanguageSwitcher />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}