"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState, useTransition } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

// Text codes instead of flag emoji: Windows renders flag emoji as plain
// letters, and languages are not countries.
const LANGUAGES: Record<Locale, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
};

export default function LanguageSwitcher({ align = "right" }: { align?: "left" | "right" }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("a11y");
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const switchTo = (next: Locale) => {
    setOpen(false);
    if (next === locale) return;
    const hash = window.location.hash;
    startTransition(() => {
      router.replace(`${pathname}${hash}`, { locale: next, scroll: false });
    });
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`${t("switchLanguage")} (${LANGUAGES[locale]})`}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          "flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium transition-all duration-200 hover:border-green-500/50 hover:bg-white/10",
          isPending && "opacity-60"
        )}
      >
        <Globe size={14} className="text-green-400" aria-hidden />
        <span className="font-semibold uppercase">{locale}</span>
        <ChevronDown
          size={14}
          aria-hidden
          className={cn("text-white/60 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="menu"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute z-50 mt-2 min-w-40 overflow-hidden rounded-xl border border-white/10 bg-neutral-900/95 shadow-2xl shadow-black/50 backdrop-blur-xl",
              align === "right" ? "right-0 top-full" : "bottom-full left-0 mb-2"
            )}
          >
            {routing.locales.map((code) => (
              <li key={code} role="none">
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={code === locale}
                  lang={code}
                  onClick={() => switchTo(code)}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-3 text-sm transition-colors duration-150 hover:bg-green-500/10 hover:text-green-300",
                    code === locale ? "bg-green-500/10 font-semibold text-green-300" : "text-white/75"
                  )}
                >
                  <span className="w-6 text-xs font-bold uppercase text-white/50">{code}</span>
                  <span>{LANGUAGES[code]}</span>
                  {code === locale && <Check size={14} className="ml-auto" aria-hidden />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
