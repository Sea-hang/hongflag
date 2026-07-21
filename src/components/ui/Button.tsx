"use client";

import { type ButtonHTMLAttributes, useRef, useState, type MouseEvent } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "tertiary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  href?: string;
}

const base =
  "relative inline-flex items-center gap-2 font-medium rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ripple-container";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--accent)] text-white px-7 py-3 text-[15px] hover:bg-[var(--accent-hover)] shadow-sm hover:shadow-md",
  secondary:
    "bg-[var(--bg-secondary)] text-[var(--text-primary)] px-7 py-3 text-[15px] hover:bg-[var(--bg-tertiary)]",
  tertiary:
    "text-[var(--accent)] px-2 py-1 text-[15px] hover:opacity-70",
};

export function Button({
  variant = "primary",
  children,
  className,
  onClick,
  href,
  ...props
}: ButtonProps) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const btnRef = useRef<HTMLButtonElement>(null);
  let nextId = useRef(0);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = btnRef.current?.getBoundingClientRect();
    if (rect) {
      setRipples((prev) => [
        ...prev,
        { x: e.clientX - rect.left, y: e.clientY - rect.top, id: nextId.current++ },
      ]);
      setTimeout(() => setRipples((prev) => prev.slice(1)), 600);
    }
    onClick?.(e);
  };

  const arrow = variant === "primary" && (
    <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">→</span>
  );

  if (href) {
    const isExternal = href.startsWith("http");
    const linkClass = cn(base, variants[variant], className);

    if (isExternal) {
      return (
        <a href={href} className={linkClass} target="_blank" rel="noopener noreferrer">
          {children}{arrow}
        </a>
      );
    }
    return (
      <Link href={href} className={linkClass}>
        {children}{arrow}
      </Link>
    );
  }

  return (
    <button ref={btnRef} className={cn(base, variants[variant], className)} onClick={handleClick} {...props}>
      {children}{arrow}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute rounded-full bg-white/20 pointer-events-none animate-[ripple_0.6s_ease-out_forwards]"
          style={{ left: r.x - 8, top: r.y - 8, width: 16, height: 16 }}
        />
      ))}
    </button>
  );
}
