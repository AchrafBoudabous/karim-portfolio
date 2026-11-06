"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Card with a cursor-following glow (the "spotlight" / "magic card" pattern
 * from Aceternity UI and Magic UI). Uses CSS variables, so moving the mouse
 * never re-renders React.
 */
export default function SpotlightCard({
  children,
  className,
  glow = "rgba(34,197,94,0.14)",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  glow?: string;
  as?: "div" | "article" | "li";
}) {
  const ref = useRef<HTMLElement>(null);

  const handleMove = (e: React.PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      onPointerMove={handleMove}
      className={cn(
        "group/spot relative overflow-hidden rounded-2xl border border-white/10 bg-white/3 transition-colors duration-300 hover:border-green-500/30",
        className
      )}
      style={{ "--spot": glow } as React.CSSProperties}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--x, 50%) var(--y, 50%), var(--spot), transparent 60%)",
        }}
      />
      <div className="relative">{children}</div>
    </Tag>
  );
}
