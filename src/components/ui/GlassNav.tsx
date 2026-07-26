"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";
import { site } from "@/data/site";
import { useAuth } from "@/lib/auth";

export function GlassNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { isTeacher } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={cn(
          "fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500",
          "w-[calc(100%-2rem)] max-w-5xl",
          scrolled ? "top-3" : "top-5"
        )}
      >
        <div
          className={cn(
            "glass rounded-2xl px-4 md:px-6 h-14 flex items-center justify-between",
            "transition-shadow duration-300",
            scrolled && "shadow-md"
          )}
        >
          {/* 校徽 + 校名 */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <svg viewBox="0 0 48 56" className="w-8 h-9 transition-transform duration-300 group-hover:scale-105" aria-hidden="true">
              <defs>
                <linearGradient id="shield-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              <path d="M24 2L4 12v16c0 12.8 8 24.8 20 28 12-3.2 20-15.2 20-28V12L24 2z"
                fill="url(#shield-grad)" stroke="var(--color-accent)" strokeWidth="1.5" />
              <path d="M16 18h16v4l-4 2v4l-4 2-4-2v-4l-4-2v-4z" fill="var(--color-accent)" opacity="0.85" />
              <rect x="16" y="18" width="2" height="16" rx="0.5" fill="var(--color-accent)" />
              <path d="M14 42h20M12 46h24" stroke="var(--color-accent)" strokeWidth="0.8" opacity="0.4" />
            </svg>
            <div className="flex flex-col leading-tight">
              <span className="text-[15px] font-bold tracking-tight" style={{ color: "var(--color-ink)" }}>
                {site.name}
              </span>
              <span className="text-[10px] tracking-wider hidden sm:block" style={{ color: "var(--color-ink-3)" }}>
                {site.location}
              </span>
            </div>
          </Link>

          {/* 桌面端链接 */}
          <div className="hidden md:flex items-center gap-1">
            {site.navLinks.map((l) => (
              <Link key={l.href} href={l.href}
                className={cn(
                  "relative text-[13px] px-3.5 py-1.5 rounded-full transition-all duration-200",
                  pathname === l.href
                    ? "font-semibold"
                    : "hover:bg-[var(--color-paper-2)]"
                )}
                style={{ color: pathname === l.href ? "var(--color-accent)" : "var(--color-ink-2)" }}
              >
                {pathname === l.href && (
                  <motion.span layoutId="nav-active"
                    className="absolute inset-0 rounded-full"
                    style={{ background: "var(--color-accent-light)" }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{l.label}</span>
              </Link>
            ))}
            {isTeacher && (
              <Link href="/admin"
                className={cn(
                  "relative text-[13px] px-3.5 py-1.5 rounded-full transition-all duration-200",
                  pathname === "/admin" ? "font-semibold" : "hover:bg-[var(--color-paper-2)]"
                )}
                style={{
                  color: pathname === "/admin" ? "var(--color-accent)" : "var(--color-ink-2)"
                }}
              >
                {pathname === "/admin" && (
                  <motion.span layoutId="nav-active"
                    className="absolute inset-0 rounded-full"
                    style={{ background: "var(--color-accent-light)" }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">⚙️ 管理</span>
              </Link>
            )}
            <div className="ml-2 pl-2 border-l" style={{ borderColor: "var(--color-rule)" }}>
              <ThemeToggle />
            </div>
          </div>

          {/* 移动端 */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button onClick={() => setOpen(!open)}
              className="p-2 rounded-full hover:bg-[var(--color-paper-2)] transition-colors"
              aria-label={open ? "关闭菜单" : "打开菜单"}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="var(--color-ink)" strokeWidth={1.5}
                style={{ color: "var(--color-ink)" }}
              >
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* 移动端菜单 */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed top-20 left-4 right-4 z-40 glass rounded-2xl p-4 shadow-lg md:hidden"
          >
            <div className="flex flex-col gap-0.5">
              {site.navLinks.map((l, i) => (
                <motion.div key={l.href} initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                >
                  <Link href={l.href} onClick={() => setOpen(false)}
                    className={cn("block px-4 py-3 text-[15px] rounded-xl transition-colors",
                      pathname === l.href ? "bg-[var(--color-accent-light)] font-semibold" : "hover:bg-[var(--color-paper-2)]"
                    )}
                    style={{
                      color: pathname === l.href ? "var(--color-accent)" : "var(--color-ink-2)"
                    }}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              {isTeacher && (
                <motion.div initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: site.navLinks.length * 0.05 }}
                >
                  <Link href="/admin" onClick={() => setOpen(false)}
                    className="block px-4 py-3 text-[15px] rounded-xl transition-colors"
                    style={{
                      color: pathname === "/admin" ? "var(--color-accent)" : "var(--color-ink-2)",
                      background: pathname === "/admin" ? "var(--color-accent-light)" : "transparent"
                    }}
                  >
                    ⚙️ 管理后台
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-30 bg-black/20 md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}
