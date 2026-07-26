"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { heroData } from "@/data/home-hero";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const [settingsBg, setSettingsBg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json() as Promise<Record<string, string>>)
      .then((s) => { if (s.heroBgImage) setSettingsBg(s.heroBgImage); })
      .catch(() => {});
  }, []);

  const bgImage = settingsBg || heroData.heroBgImage;

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 背景 */}
      {bgImage ? (
        <div className="absolute inset-0 -z-10">
          <img src={bgImage} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-paper)]/20 via-transparent to-[var(--color-paper)]" />
        </div>
      ) : (
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full max-md:blur-[60px] blur-[120px] opacity-20"
            style={{ background: "var(--color-accent)" }}
          />
          <div
            className="absolute top-1/2 right-1/4 w-[350px] h-[350px] rounded-full max-md:blur-[45px] blur-[90px] opacity-12"
            style={{ background: "var(--color-accent-light)" }}
          />
        </div>
      )}

      {/* 点阵纹理 */}
      <div
        className="absolute inset-0 -z-5 opacity-[0.02] dark:opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Hero 内容 — Braindrop 风格：巨大标题 + 简洁副标题 */}
      <motion.div
        style={{ y, opacity }}
        className="text-center px-5 max-w-4xl mx-auto"
      >
        {/* 标签 */}
        <motion.p
          custom={0} initial="hidden" animate="visible" variants={fadeUp}
          className="text-[13px] font-medium tracking-[0.15em] uppercase mb-6"
          style={{ color: "var(--color-warm)" }}
        >
          {heroData.tagline}
        </motion.p>

        {/* 巨大标题 — 衬线字体，极小行高，如 Braindrop */}
        <motion.h1
          custom={1} initial="hidden" animate="visible" variants={fadeUp}
          className="font-bold leading-[0.95] tracking-[-0.005em] max-md:text-[max(2.5rem,11vw)]"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-display)",
            color: "var(--color-ink)",
          }}
        >
          {heroData.titleLine1}{" "}
          {heroData.titleLine2}{" "}
          <span className="relative" style={{ color: "var(--color-accent)" }}>
            {heroData.titleAccent}
            <span
              className="absolute -bottom-1 left-0 w-full h-[3px] rounded-full opacity-60"
              style={{ background: "var(--color-accent)" }}
            />
          </span>
        </motion.h1>

        {/* 副标题 */}
        <motion.p
          custom={2} initial="hidden" animate="visible" variants={fadeUp}
          className="text-[17px] md:text-[22px] leading-relaxed max-md:max-w-none max-w-lg mx-auto mt-8 mb-10"
          style={{ color: "var(--color-ink-2)" }}
        >
          {heroData.subtitle}
        </motion.p>

        {/* CTA */}
        <motion.div
          custom={3} initial="hidden" animate="visible" variants={fadeUp}
          className="flex items-center justify-center gap-4 flex-wrap"
        >
          <Button variant="primary" href="/about">{heroData.primaryButton}</Button>
          <Button variant="secondary" href="/about">{heroData.secondaryButton}</Button>
        </motion.div>
      </motion.div>

      {/* 滚动提示 — 手机端隐藏 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="max-md:hidden absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border-2 flex items-start justify-center p-1"
          style={{ borderColor: "var(--color-ink-3)" }}
        >
          <motion.div
            animate={{ opacity: [1, 0.3, 1], y: [0, 3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-2 rounded-full"
            style={{ background: "var(--color-accent)" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
