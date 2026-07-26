"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { GlassNav } from "@/components/ui/GlassNav";
import { Footer } from "@/components/ui/Footer";
import { aboutData } from "@/data/about";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function AboutPage() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [settingsImg, setSettingsImg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json() as Promise<Record<string, string>>)
      .then((s) => { if (s.aboutImage) setSettingsImg(s.aboutImage); })
      .catch(() => {});
  }, []);

  const image = settingsImg || aboutData.image;

  return (
    <>
      <GlassNav />
      <main className="pt-28 pb-16">
        {/* ===== Header: Long Document 开篇 ===== */}
        <section className="max-w-3xl mx-auto px-5 pt-16 pb-4">
          <motion.div
            custom={0} initial="hidden" animate="visible" variants={fadeUp}
            className="flex items-center gap-3 mb-4"
          >
            <div className="h-[2px] w-6 rounded-full" style={{ background: "var(--color-accent)" }} />
            <span className="text-[12px] font-medium tracking-[0.12em] uppercase text-[var(--color-accent)]">
              {aboutData.label}
            </span>
          </motion.div>

          <motion.h1
            custom={1} initial="hidden" animate="visible" variants={fadeUp}
            className="text-[var(--text-display-s)] font-bold tracking-tight leading-[1.1] mb-4"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
          >
            {aboutData.title}
          </motion.h1>

          <motion.p
            custom={2} initial="hidden" animate="visible" variants={fadeUp}
            className="text-[17px] leading-relaxed"
            style={{ color: "var(--color-ink-2)" }}
          >
            {aboutData.subtitle}
          </motion.p>
        </section>

        {/* ===== Content: 正文 + 图片 ===== */}
        <section ref={ref} className="max-w-5xl mx-auto px-5 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-16 items-start">
            {/* 正文 (占 3/5) */}
            <motion.div
              className="md:col-span-3 space-y-5 text-[16px] leading-relaxed"
              style={{ color: "var(--color-ink-2)" }}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={fadeUp}
            >
              {aboutData.introParagraphs.map((p, i) => (
                <p
                  key={i}
                  className={i === 0 ? "text-[18px] font-semibold leading-snug" : ""}
                  style={i === 0 ? { color: "var(--color-ink)", fontFamily: "var(--font-display)" } : undefined}
                >
                  {p}
                </p>
              ))}
            </motion.div>

            {/* 图片 (占 2/5) */}
            <motion.div
              className="md:col-span-2"
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={fadeUp}
            >
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-md aspect-[4/3] border-2"
                  style={{ borderColor: "var(--color-accent-light)" }}
                >
                  {image ? (
                    <img
                      src={image}
                      alt="学校照片"
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl"
                      style={{ background: "var(--color-paper-2)" }}
                    >
                      🏫
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* ===== 办学理念: 四栏卡片 ===== */}
          <div className="mt-28">
            {/* 章节标题 */}
            <motion.div
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={fadeUp}
              className="text-center mb-14"
            >
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="h-px w-12" style={{ background: "var(--color-rule)" }} />
                <span className="text-[12px] font-medium tracking-[0.12em] uppercase" style={{ color: "var(--color-accent)" }}>
                  办学理念
                </span>
                <div className="h-px w-12" style={{ background: "var(--color-rule)" }} />
              </div>
              <h2
                className="text-[var(--text-2xl)] font-bold tracking-tight"
                style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
              >
                {aboutData.philosophyTitle}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              {aboutData.philosophyCards.map((item, i) => (
                <motion.div
                  key={item.label}
                  custom={i}
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                  variants={fadeUp}
                  className="rounded-2xl p-7 text-center transition-all duration-300 hover:-translate-y-1 border"
                  style={{
                    background: "var(--color-paper-2)",
                    borderColor: "var(--color-rule)",
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold mx-auto mb-4"
                    style={{
                      background: "var(--color-accent-light)",
                      color: "var(--color-accent)",
                      fontFamily: "var(--font-display)",
                      fontSize: "1.3rem",
                    }}
                  >
                    {item.icon}
                  </div>
                  <h3 className="font-bold mb-2" style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)" }}>
                    {item.label}
                  </h3>
                  <p className="text-[13px]" style={{ color: "var(--color-ink-2)" }}>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
