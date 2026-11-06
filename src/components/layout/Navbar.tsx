"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, CalendarDays } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import Button from "@/components/ui/Button";
import { useBooking } from "@/components/booking/BookingProvider";
import { NAV_KEYS } from "@/lib/nav";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const t = useTranslations("nav");
  const tBooking = useTranslations("booking");
  const tA11y = useTranslations("a11y");
  const { openBooking } = useBooking();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  // Header background
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active section via IntersectionObserver (no layout reads on scroll).
  useEffect(() => {
    const sections = NAV_KEYS.map((k) => document.getElementById(k)).filter(
      (el): el is HTMLElement => el !== null
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Mobile menu: Escape to close + lock page scroll while open.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-300 focus:rounded-lg focus:bg-green-500 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-black"
      >
        {tA11y("skipToContent")}
      </a>

      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-white/5 bg-neutral-950/80 shadow-xl shadow-black/20 backdrop-blur-xl"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-20 md:px-8">
          <a href="#main" className="group flex items-center gap-2" aria-label={tA11y("backToTop")}>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-green-400 to-emerald-600 font-oswald text-sm font-bold text-black transition-transform duration-300 group-hover:rotate-6">
              KB
            </span>
            <span className="hidden font-oswald text-lg font-bold tracking-wide sm:block">
              <span className="text-white">KARIM</span>
              <span className="text-green-400"> B.</span>
            </span>
          </a>

          <nav aria-label={tA11y("mainNav")} className="hidden items-center gap-1 rounded-full border border-white/5 bg-white/2 p-1 lg:flex">
            {NAV_KEYS.map((key) => (
              <a
                key={key}
                href={`#${key}`}
                aria-current={active === key ? "true" : undefined}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
                  active === key ? "text-green-300" : "text-white/70 hover:text-white"
                )}
              >
                {active === key && (
                  <motion.span
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-full border border-green-500/25 bg-green-500/10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative">{t(key)}</span>
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Button size="sm" onClick={openBooking} className="hidden md:inline-flex" shine>
              <CalendarDays size={15} aria-hidden />
              {tBooking("title")}
            </Button>
            <LanguageSwitcher />
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="rounded-lg border border-white/10 bg-white/5 p-2 transition-colors hover:bg-white/10 lg:hidden"
              aria-label={mobileOpen ? tA11y("closeMenu") : tA11y("openMenu")}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              className="absolute bottom-0 right-0 top-0 flex w-72 max-w-[85vw] flex-col border-l border-white/10 bg-neutral-950 px-6 pb-8 pt-20"
            >
              <nav aria-label={tA11y("mainNav")} className="flex flex-col gap-1">
                {NAV_KEYS.map((key, i) => (
                  <motion.a
                    key={key}
                    href={`#${key}`}
                    onClick={() => setMobileOpen(false)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={cn(
                      "rounded-xl px-4 py-3 text-base font-medium transition-colors duration-200",
                      active === key
                        ? "border border-green-500/20 bg-green-500/10 text-green-300"
                        : "text-white/75 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {t(key)}
                  </motion.a>
                ))}
                <Button
                  className="mt-3"
                  onClick={() => {
                    setMobileOpen(false);
                    openBooking();
                  }}
                >
                  <CalendarDays size={16} aria-hidden />
                  {tBooking("title")}
                </Button>
              </nav>

              <div className="mt-auto border-t border-white/10 pt-6">
                <p className="mb-4 text-xs uppercase tracking-widest text-white/50">{t("language")}</p>
                <LanguageSwitcher align="left" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
