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
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
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
      <main className="pt-24 pb-16">
        {/* Header */}
        <section className="max-w-5xl mx-auto px-5 pt-12 pb-10 text-center">
          <motion.p
            custom={0} initial="hidden" animate="visible" variants={fadeUp}
            className="text-[13px] font-medium text-[var(--accent)] tracking-wide mb-3"
          >
            {aboutData.label}
          </motion.p>
          <motion.h1
            custom={1} initial="hidden" animate="visible" variants={fadeUp}
            className="text-[36px] md:text-[48px] font-bold tracking-tight text-[var(--text-primary)]"
          >
            {aboutData.title}
          </motion.h1>
          <motion.p
            custom={2} initial="hidden" animate="visible" variants={fadeUp}
            className="text-[17px] text-[var(--text-secondary)] mt-4"
          >
            {aboutData.subtitle}
          </motion.p>
        </section>

        {/* Content */}
        <section ref={ref} className="max-w-5xl mx-auto px-5 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp}
              className="space-y-5 text-[16px] text-[var(--text-secondary)] leading-relaxed"
            >
              {aboutData.introParagraphs.map((p, i) => (
                <p
                  key={i}
                  className={i === 0 ? "text-[var(--text-primary)] text-[19px] font-semibold leading-snug" : ""}
                >
                  {p}
                </p>
              ))}
            </motion.div>
            <motion.div
              initial="hidden" animate={inView ? "visible" : "hidden"}
              variants={fadeUp}
              className="rounded-3xl aspect-square overflow-hidden hover:scale-[1.02] transition-transform duration-500 shadow-lg"
            >
              {image ? (
                <img
                  src={image}
                  alt="学校照片"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-7xl">
                  🏫
                </div>
              )}
            </motion.div>
          </div>

          {/* 办学理念 */}
          <div className="mt-24">
            <motion.h2
              initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp}
              className="text-[28px] md:text-[32px] font-bold text-center tracking-tight mb-10"
            >
              {aboutData.philosophyTitle}
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              {aboutData.philosophyCards.map((item, i) => (
                <motion.div
                  key={item.label}
                  custom={i}
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                  variants={fadeUp}
                  className="bg-[var(--bg-secondary)] rounded-2xl p-7 text-center hover:bg-[var(--bg-tertiary)] transition-colors duration-300"
                >
                  <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center text-xl mx-auto mb-4 font-bold`}>
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-[var(--text-primary)] mb-2">{item.label}</h3>
                  <p className="text-[13px] text-[var(--text-secondary)]">{item.desc}</p>
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
