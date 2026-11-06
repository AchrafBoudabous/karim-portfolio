"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import BookingModal from "@/components/ui/BookingModal";

interface BookingContextValue {
  openBooking: () => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

/** One booking dialog for the whole page, opened from anywhere. */
export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const openBooking = useCallback(() => setOpen(true), []);
  const value = useMemo(() => ({ openBooking }), [openBooking]);

  return (
    <BookingContext.Provider value={value}>
      {children}
      <BookingModal open={open} onOpenChange={setOpen} />
    </BookingContext.Provider>
  );
}

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}
