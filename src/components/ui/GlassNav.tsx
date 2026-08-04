"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";
import { site } from "@/data/site";
import { useAuth } from "@/lib/auth";
import { WeChatPopup } from "./WeChatPopup";

export function GlassNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [wechatOpen, setWechatOpen] = useState(false);
  const pathname = usePathname();
  const { isTeacher } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 手机端菜单打开时锁定滚动
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // 菜单项对应图标
  const navIcons: Record<string, string> = {
    "/": "🏠",
    "/about": "📖",
    "/activities": "📋",
    "/contact": "📞",
  };

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
            "glass rounded-2xl px-4 md:px-6 max-md:h-12 h-14 flex items-center justify-between",
            "transition-shadow duration-300",
            scrolled && "shadow-md"
          )}
        >
          {/* 校徽 + 校名（无社交媒体，避免 a 嵌套） */}
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

          {/* 社交媒体（在 Link 外部，避免 a 嵌套） */}
          <div className="hidden md:flex items-center gap-1.5 ml-1 mr-auto">
            <a href={site.douyinUrl} target="_blank" rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center justify-center w-7 h-7 rounded-md hover:bg-[var(--color-paper-2)] transition-colors"
              title="抖音作品"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" style={{ color: "var(--color-ink-2)" }}>
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.52 2.89 2.89 0 0 1-2.88-2.89 2.89 2.89 0 0 1 2.88-2.89c.27 0 .53.04.78.1v-3.5a6.34 6.34 0 0 0-.78-.05A6.34 6.34 0 0 0 3 15.3a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.72a8.23 8.23 0 0 0 4.47 1.48v-3.5a4.8 4.8 0 0 1-.56-.01z"/>
              </svg>
            </a>
            <button
              onClick={(e) => { e.stopPropagation(); setWechatOpen(true); }}
              className="inline-flex items-center justify-center w-7 h-7 rounded-md hover:bg-[var(--color-paper-2)] transition-colors cursor-pointer"
              title="微信公众号：宜阳县红旗实验学校"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" style={{ color: "var(--color-ink-2)" }}>
                <path d="M8.5 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm7 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM12 2C6.48 2 2 6.48 2 12c0 1.93.55 3.72 1.5 5.26L2 22l4.93-1.52C8.2 21.42 10.04 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.73 0-3.36-.5-4.76-1.36l-.34-.2-3.05.94.93-3.04-.22-.36A7.96 7.96 0 0 1 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z"/>
              </svg>
            </button>
          </div>

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
          <motion.div initial={{ opacity: 0, y: -12, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }} transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed top-16 left-4 right-4 z-40 glass rounded-2xl p-5 shadow-lg md:hidden overflow-hidden"
          >
            {/* 菜单头部 */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b" style={{ borderColor: "var(--color-rule)" }}>
              <span className="text-[22px]">🏫</span>
              <div>
                <p className="text-[14px] font-bold" style={{ color: "var(--color-ink)" }}>{site.name}</p>
                <p className="text-[11px]" style={{ color: "var(--color-ink-3)" }}>{site.location}</p>
              </div>
              <button onClick={() => setOpen(false)}
                className="ml-auto p-2 rounded-full hover:bg-[var(--color-paper-2)] transition-colors"
                aria-label="关闭菜单"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="var(--color-ink)" strokeWidth={1.5}
                  style={{ color: "var(--color-ink)" }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col gap-0.5">
              {site.navLinks.map((l, i) => (
                <motion.div key={l.href} initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                >
                  <Link href={l.href} onClick={() => setOpen(false)}
                    className={cn("block px-5 py-4 text-[16px] rounded-xl transition-all duration-200 font-medium",
                      pathname === l.href
                        ? "bg-[var(--color-accent-light)] shadow-sm"
                        : "hover:bg-[var(--color-paper-2)] active:scale-[0.98]"
                    )}
                    style={{
                      color: pathname === l.href ? "var(--color-accent)" : "var(--color-ink)",
                    }}
                  >
                    <span className="inline-flex items-center gap-3">
                      <span className="text-[20px]">{navIcons[l.href] || "•"}</span>
                      <span>{l.label}</span>
                    </span>
                    {pathname === l.href && (
                      <span className="float-right mt-0.5 text-[var(--color-accent)] opacity-60">←</span>
                    )}
                  </Link>
                </motion.div>
              ))}
              {isTeacher && (
                <motion.div initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: site.navLinks.length * 0.05 }}
                >
                  <Link href="/admin" onClick={() => setOpen(false)}
                    className="block px-5 py-4 text-[16px] rounded-xl transition-all duration-200 font-medium"
                    style={{
                      color: pathname === "/admin" ? "var(--color-accent)" : "var(--color-ink)",
                      background: pathname === "/admin" ? "var(--color-accent-light)" : "transparent"
                    }}
                  >
                    <span className="inline-flex items-center gap-3">
                      <span className="text-[20px]">⚙️</span>
                      <span>管理后台</span>
                    </span>
                  </Link>
                </motion.div>
              )}
            </div>

            {/* 菜单底部 — 社交入口 */}
            <div className="mt-4 pt-4 border-t flex items-center justify-center gap-5" style={{ borderColor: "var(--color-rule)" }}>
              <a href={site.douyinUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[13px] py-2 px-3 rounded-xl hover:bg-[var(--color-paper-2)] transition-colors"
                style={{ color: "var(--color-ink-2)" }}
                onClick={() => setOpen(false)}
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.52 2.89 2.89 0 0 1-2.88-2.89 2.89 2.89 0 0 1 2.88-2.89c.27 0 .53.04.78.1v-3.5a6.34 6.34 0 0 0-.78-.05A6.34 6.34 0 0 0 3 15.3a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.72a8.23 8.23 0 0 0 4.47 1.48v-3.5a4.8 4.8 0 0 1-.56-.01z"/>
                </svg>
                抖音
              </a>
              <button
                className="flex items-center gap-1.5 text-[13px] py-2 px-3 rounded-xl hover:bg-[var(--color-paper-2)] transition-colors cursor-pointer"
                style={{ color: "var(--color-ink-2)" }}
                onClick={() => { setOpen(false); setWechatOpen(true); }}
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                  <path d="M8.5 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm7 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM12 2C6.48 2 2 6.48 2 12c0 1.93.55 3.72 1.5 5.26L2 22l4.93-1.52C8.2 21.42 10.04 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.73 0-3.36-.5-4.76-1.36l-.34-.2-3.05.94.93-3.04-.22-.36A7.96 7.96 0 0 1 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z"/>
                </svg>
                公众号
              </button>
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

      {/* 微信二维码弹窗 */}
      <WeChatPopup
        open={wechatOpen}
        onClose={() => setWechatOpen(false)}
        wechatUrl={site.wechatUrl}
      />
    </>
  );
}
