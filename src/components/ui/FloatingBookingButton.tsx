"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { CalendarDays } from "lucide-react";
import { useBooking } from "@/components/booking/BookingProvider";

export default function FloatingBookingButton() {
  const t = useTranslations("booking");
  const { openBooking } = useBooking();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openBooking}
          aria-label={t("floatingBtn")}
          className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-6 z-150 flex md:hidden items-center gap-2 rounded-full bg-linear-to-r from-green-500 to-emerald-600 px-4 py-3 text-sm font-bold text-black shadow-2xl shadow-green-500/30 transition-shadow duration-300 hover:shadow-green-500/50 sm:px-5"
        >
          <CalendarDays size={18} aria-hidden />
          <span className="hidden sm:inline">{t("floatingBtn")}</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
