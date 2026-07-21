"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";
import { site } from "@/data/site";
import { useAuth } from "@/lib/auth";

export function GlassNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { isTeacher } = useAuth();

  return (
    <>
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl">
        <div className="glass rounded-2xl px-5 h-12 flex items-center justify-between shadow-sm">
          <Link
            href="/"
            className="text-[15px] font-semibold text-[var(--text-primary)] hover:opacity-70 transition-opacity flex-shrink-0"
          >
            {site.shortName}
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {site.navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "text-[13px] px-3 py-1.5 rounded-full transition-colors duration-200",
                  pathname === l.href
                    ? "bg-[var(--accent-light)] text-[var(--accent)] font-medium"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                )}
              >
                {l.label}
              </Link>
            ))}
            {isTeacher && (
              <Link
                href="/admin"
                className={cn(
                  "text-[13px] px-3 py-1.5 rounded-full transition-colors duration-200",
                  pathname === "/admin"
                    ? "bg-[var(--accent-light)] text-[var(--accent)] font-medium"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                )}
              >
                ⚙️ 管理
              </Link>
            )}
            <div className="ml-2 pl-2 border-l border-[var(--border)]">
              <ThemeToggle />
            </div>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setOpen(!open)}
              className="p-1.5 rounded-full hover:bg-[var(--bg-secondary)] transition-colors"
              aria-label="菜单"
            >
              <svg className="w-5 h-5 text-[var(--text-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed top-20 left-4 right-4 z-40 glass rounded-2xl p-4 shadow-lg md:hidden"
          >
            <div className="flex flex-col gap-0.5">
              {site.navLinks.map((l, i) => (
                <motion.div key={l.href} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block px-4 py-3 text-[15px] rounded-xl transition-colors",
                      pathname === l.href
                        ? "bg-[var(--accent-light)] text-[var(--accent)] font-medium"
                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
                    )}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              {isTeacher && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: site.navLinks.length * 0.05 }}>
                  <Link
                    href="/admin"
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block px-4 py-3 text-[15px] rounded-xl transition-colors",
                      pathname === "/admin"
                        ? "bg-[var(--accent-light)] text-[var(--accent)] font-medium"
                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
                    )}
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-30 bg-black/20 md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}
