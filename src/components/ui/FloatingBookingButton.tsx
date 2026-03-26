"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { CalendarDays } from "lucide-react";
import BookingModal from "./BookingModal";

export default function FloatingBookingButton() {
  const t = useTranslations("booking");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="fixed bottom-6 right-6 z-[150] flex items-center gap-2 px-5 py-3 rounded-full bg-linear-to-r from-green-500 to-emerald-600 text-black font-bold text-sm shadow-2xl shadow-green-500/30 hover:shadow-green-500/50 transition-shadow duration-300"
          >
            <CalendarDays size={18} />
            <span className="hidden sm:inline">{t("floatingBtn")}</span>
          </motion.button>
        )}
      </AnimatePresence>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}