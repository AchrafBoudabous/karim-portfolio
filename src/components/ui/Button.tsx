import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "relative overflow-hidden bg-linear-to-r from-green-500 to-emerald-600 text-black font-bold shadow-lg shadow-green-500/20 hover:shadow-green-500/40 hover:brightness-110",
  secondary:
    "border border-white/15 bg-white/5 text-white/85 hover:text-white hover:border-green-500/50 hover:bg-green-500/10 font-medium",
  ghost: "text-white/70 hover:text-white hover:bg-white/5 font-medium",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm gap-2 rounded-lg",
  md: "h-11 px-6 text-sm gap-2 rounded-xl",
  lg: "h-14 px-8 text-sm gap-2.5 rounded-xl tracking-wide",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
} = {}) {
  return cn(
    "inline-flex items-center justify-center whitespace-nowrap transition-all duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60",
    variants[variant],
    sizes[size],
    className
  );
}

/** Animated light sweep used on primary call-to-actions (Magic UI "shine"). */
export function Shine() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-transparent via-white/40 to-transparent animate-shimmer"
    />
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  shine?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, shine, className, children, type = "button", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={buttonClasses({ variant, size, className })}
      {...props}
    >
      {shine && <Shine />}
      <span className="relative inline-flex items-center gap-[inherit]">
        {children}
      </span>
    </button>
  );
});

export default Button;
