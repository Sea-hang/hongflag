"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { heroData } from "@/data/home-hero";

const stagger = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
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
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {bgImage ? (
        <div className="absolute inset-0 -z-10">
          <img src={bgImage} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ) : (
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px] dark:bg-blue-500/10" />
          <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-purple-500/15 rounded-full blur-[100px] dark:bg-purple-500/8" />
          <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-cyan-500/15 rounded-full blur-[80px] dark:bg-cyan-500/8" />
        </div>
      )}

      <div className="absolute inset-0 -z-5 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <motion.div style={{ y, opacity }} className="text-center px-5 max-w-4xl">
        <motion.p
          custom={0} initial="hidden" animate="visible" variants={stagger}
          className="text-[13px] font-medium tracking-widest uppercase text-[var(--accent)] mb-6"
        >
          {heroData.tagline}
        </motion.p>

        <motion.h1
          custom={1} initial="hidden" animate="visible" variants={stagger}
          className="text-[48px] md:text-[72px] lg:text-[88px] font-bold tracking-tight leading-[1.02] text-[var(--text-primary)]"
        >
          {heroData.titleLine1}
          <br />
          {heroData.titleLine2}
          <br />
          <span className="text-[var(--accent)]">{heroData.titleAccent}</span>
        </motion.h1>

        <motion.p
          custom={2} initial="hidden" animate="visible" variants={stagger}
          className="text-[17px] md:text-[19px] text-[var(--text-secondary)] max-w-lg mx-auto mt-6 mb-10 leading-relaxed"
        >
          {heroData.subtitle}
        </motion.p>

        <motion.div
          custom={3} initial="hidden" animate="visible" variants={stagger}
          className="flex items-center justify-center gap-4 flex-wrap"
        >
          <Button variant="primary" href="/about">{heroData.primaryButton}</Button>
          <Button variant="secondary" href="/about">{heroData.secondaryButton}</Button>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border-2 border-[var(--text-tertiary)] flex items-start justify-center p-1"
        >
          <div className="w-1 h-2 rounded-full bg-[var(--text-tertiary)]" />
        </motion.div>
      </div>
    </section>
  );
}
