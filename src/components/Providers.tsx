"use client";

import { MotionConfig } from "framer-motion";
import { BookingProvider } from "@/components/booking/BookingProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    // Respect the OS "reduce motion" setting for every Framer animation.
    <MotionConfig reducedMotion="user">
      <BookingProvider>{children}</BookingProvider>
    </MotionConfig>
  );
}
