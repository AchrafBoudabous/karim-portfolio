"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type FieldState = "idle" | "valid" | "invalid";

export function inputClasses(state: FieldState, className?: string) {
  return cn(
    "w-full rounded-xl border bg-white/4 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition-all duration-200 focus:bg-white/7 focus:ring-2",
    state === "invalid" &&
      "border-red-500/60 focus:border-red-500/80 focus:ring-red-500/15",
    state === "valid" &&
      "border-green-500/45 focus:border-green-500/70 focus:ring-green-500/15",
    state === "idle" &&
      "border-white/12 hover:border-white/20 focus:border-green-500/50 focus:ring-green-500/10",
    className
  );
}

/**
 * Label + control + accessible error message.
 * The control receives `aria-invalid` / `aria-describedby` via render props.
 */
export default function FormField({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: React.ReactNode;
  children: (aria: {
    id: string;
    "aria-invalid": boolean;
    "aria-describedby"?: string;
  }) => React.ReactNode;
}) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/60"
      >
        {label}
      </label>
      {children({
        id,
        "aria-invalid": Boolean(error),
        "aria-describedby": error ? errorId : undefined,
      })}
      <div className="mt-1.5 flex min-h-4 items-start justify-between gap-3">
        <AnimatePresence initial={false}>
          {error && (
            <motion.p
              key={error}
              id={errorId}
              role="alert"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-center gap-1 text-xs text-red-400"
            >
              <AlertCircle size={12} aria-hidden />
              {error}
            </motion.p>
          )}
        </AnimatePresence>
        {hint && <span className="ml-auto text-xs">{hint}</span>}
      </div>
    </div>
  );
}

/** Off-screen honeypot input. Humans never fill it; naive bots do. */
export function Honeypot({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Website
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </div>
  );
}
