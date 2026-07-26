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
  "relative inline-flex items-center gap-2 font-medium rounded-[6px] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<ButtonVariant, string> = {
  primary:
    "text-white px-7 py-3 text-[15px] hover:shadow-md active:scale-[0.97]",
  secondary:
    "bg-transparent px-7 py-3 text-[15px] border hover:bg-[var(--color-accent-light)]",
  tertiary:
    "px-2 py-1 text-[14px] hover:opacity-70",
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
  const nextId = useRef(0);

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

  const stylePrimary = variant === "primary" ? { background: "var(--color-accent)" } : {};
  const styleSecondary = variant === "secondary" ? {
    borderColor: "var(--color-rule)" as string,
    color: "var(--color-ink)" as string,
  } : {};
  const styleTertiary = variant === "tertiary" ? { color: "var(--color-accent)" as string } : {};

  const classNameOutput = cn(base, variants[variant], className);

  const content = (
    <>
      {children}
      {variant === "primary" && (
        <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">→</span>
      )}
      {ripples.map((r) => (
        <span key={r.id}
          className="absolute rounded-full bg-white/20 pointer-events-none animate-[ripple_0.6s_ease-out_forwards]"
          style={{ left: r.x - 8, top: r.y - 8, width: 16, height: 16 }}
        />
      ))}
    </>
  );

  const sharedStyle = { ...stylePrimary, ...styleSecondary, ...styleTertiary };

  if (href) {
    const isExternal = href.startsWith("http");
    if (isExternal) {
      return <a href={href} className={classNameOutput} style={sharedStyle} target="_blank" rel="noopener noreferrer">{content}</a>;
    }
    return <Link href={href} className={classNameOutput} style={sharedStyle}>{content}</Link>;
  }

  return (
    <button ref={btnRef} className={classNameOutput} style={sharedStyle} onClick={handleClick} {...props}>
      {content}
    </button>
  );
}
