import { cn } from "@/lib/utils";

/**
 * Infinite horizontal scroller (Magic UI "marquee"), pure CSS.
 * Pauses on hover and stops entirely for users who prefer reduced motion.
 */
export default function Marquee({
  children,
  className,
  duration = "40s",
  gap = "1rem",
}: {
  children: React.ReactNode;
  className?: string;
  duration?: string;
  gap?: string;
}) {
  return (
    <div
      className={cn(
        "group/marquee relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
        className
      )}
      style={
        {
          "--marquee-duration": duration,
          "--marquee-gap": gap,
          gap,
        } as React.CSSProperties
      }
    >
      {[0, 1].map((copy) => (
        <div
          key={copy}
          aria-hidden={copy === 1 || undefined}
          className="flex shrink-0 items-center animate-marquee group-hover/marquee:[animation-play-state:paused] motion-reduce:animate-none"
          style={{ gap }}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
