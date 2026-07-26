"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Activity {
  id: string;
  type: "notice" | "news";
  title: string;
  date: string;
  summary?: string;
  link?: string;
}

const bookColors = [
  { spine: "linear-gradient(135deg, var(--color-accent-deep), #4a3a8a)", cover: "var(--color-accent-deep)", text: "#fff" },
  { spine: "linear-gradient(135deg, #2c5282, #1a365d)", cover: "#1a365d", text: "#fff" },
  { spine: "linear-gradient(135deg, var(--color-accent), #6b5ce7)", cover: "var(--color-accent)", text: "#fff" },
];

export function StackedBooks() {
  const [books, setBooks] = useState<Activity[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/activities")
      .then((r) => r.json() as Promise<Activity[]>)
      .then((data) => setBooks(data.slice(0, 3)))
      .catch(() => {});
  }, []);

  if (books.length === 0) return null;

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-5">
        {/* 简洁的顶部标签 */}
        <div className="flex items-center gap-3 mb-3 justify-center">
          <div className="h-px w-8" style={{ background: "var(--color-warm)" }} />
          <span className="text-[12px] font-medium tracking-[0.12em] uppercase" style={{ color: "var(--color-warm)" }}>
            最新动态
          </span>
          <div className="h-px w-8" style={{ background: "var(--color-warm)" }} />
        </div>

        <h2
          className="text-center text-[var(--text-2xl)] font-bold tracking-tight mb-16 leading-[1.15]"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
        >
          校园书讯
        </h2>

        {/* 桌面端 3D 堆叠书本 */}
        <div className="hidden md:relative md:flex md:justify-center" style={{ perspective: "800px" }}>
          {books.map((book, i) => {
            const isTop = i === 0;
            const isHovered = hovered === i;
            const zIndex = isHovered ? books.length + 10 : books.length - i;

            return (
              <motion.a
                key={book.id}
                href={book.link || "#"}
                target={book.link ? "_blank" : undefined}
                rel={book.link ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 60, rotateX: 15 }}
                animate={{
                  opacity: 1,
                  y: isHovered ? -20 : i * 8,
                  rotateX: isHovered ? 0 : 15 - i * 5,
                  z: isHovered ? 60 : 0,
                }}
                transition={{
                  delay: i * 0.15,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1] as const,
                }}
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)}
                style={{
                  zIndex,
                  width: "clamp(220px, 60vw, 400px)",
                  transformStyle: "preserve-3d",
                  perspective: "800px",
                }}
                className="absolute cursor-pointer"
              >
                {/* 书本主体 */}
                <div
                  className="relative rounded-r-sm overflow-hidden transition-shadow duration-300"
                  style={{
                    background: bookColors[i].cover,
                    boxShadow: isHovered
                      ? `0 20px 60px rgba(0,0,0,0.2)`
                      : `0 ${4 + i * 2}px ${12 + i * 6}px rgba(0,0,0,${0.1 + i * 0.03})`,
                    transform: `rotate(${isHovered ? 0 : (i - 1) * 2}deg)`,
                    transition: "box-shadow 0.3s ease, transform 0.4s ease",
                  }}
                >
                  {/* 书脊顶部光效 */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1 rounded-t-sm opacity-50"
                    style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)" }}
                  />

                  <div className="flex items-start gap-4 p-5 md:p-6">
                    {/* 书脊装饰条 */}
                    <div
                      className="w-1 self-stretch rounded-full flex-shrink-0"
                      style={{
                        background: bookColors[i].spine,
                        opacity: 0.6,
                      }}
                    />

                    {/* 内容 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[11px] font-bold tracking-[0.08em] uppercase opacity-60"
                          style={{ color: bookColors[i].text }}
                        >
                          {book.type === "notice" ? "通知" : "新闻"}
                        </span>
                        <span className="text-[11px] opacity-40" style={{ color: bookColors[i].text }}>
                          {book.date}
                        </span>
                      </div>
                      <h3
                        className="text-[17px] md:text-[19px] font-bold leading-[1.25] tracking-tight line-clamp-2"
                        style={{ color: bookColors[i].text, fontFamily: "var(--font-display)" }}
                      >
                        {book.title}
                      </h3>
                      {book.summary && (
                        <p
                          className="text-[13px] mt-1.5 leading-relaxed opacity-70 line-clamp-1"
                          style={{ color: bookColors[i].text }}
                        >
                          {book.summary}
                        </p>
                      )}

                      {/* 阅读提示 */}
                      <div className="mt-3 flex items-center gap-1 text-[12px] font-medium opacity-60"
                        style={{ color: bookColors[i].text }}
                      >
                        <span>阅读全文</span>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </div>
                    </div>

                    {/* 页码装饰 */}
                    <span
                      className="text-[11px] font-bold opacity-30 flex-shrink-0 mt-1"
                      style={{ color: bookColors[i].text, fontFamily: "var(--font-display)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>

        {/* 占位高度（仅桌面端 3D 效果需要） */}
        <div className="hidden md:block" style={{ height: `${8 * (books.length - 1) + 100}px` }} />

        {/* 手机端平面列表 */}
        <div className="md:hidden space-y-3">
          {books.map((book, i) => (
            <motion.a
              key={book.id}
              href={book.link || "#"}
              target={book.link ? "_blank" : undefined}
              rel={book.link ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
              className="block rounded-xl overflow-hidden active:scale-[0.98] transition-transform duration-200 border"
              style={{ borderColor: bookColors[i].cover }}
            >
              <div className="flex items-stretch" style={{ background: "var(--color-card)" }}>
                {/* 左侧色条 */}
                <div className="w-1.5 flex-shrink-0" style={{ background: bookColors[i].spine }} />
                {/* 内容 */}
                <div className="flex-1 flex items-center py-4 pl-4 pr-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[11px] font-bold tracking-[0.06em] uppercase"
                        style={{ color: bookColors[i].cover === "var(--color-accent)" ? "var(--color-accent)" : bookColors[i].cover }}
                      >
                        {book.type === "notice" ? "📢 通知" : "📰 新闻"}
                      </span>
                      <span className="text-[11px]" style={{ color: "var(--color-ink-3)" }}>
                        {book.date}
                      </span>
                    </div>
                    <h3 className="text-[15px] font-bold leading-snug line-clamp-1 tracking-[-0.01em]"
                      style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)" }}
                    >
                      {book.title}
                    </h3>
                    {book.summary && (
                      <p className="text-[12px] mt-0.5 line-clamp-1" style={{ color: "var(--color-ink-2)" }}>
                        {book.summary}
                      </p>
                    )}
                  </div>
                  <span className="ml-2 flex-shrink-0 text-[14px]" style={{ color: "var(--color-ink-3)" }}>→</span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
