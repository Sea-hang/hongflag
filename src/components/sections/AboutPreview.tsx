"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { aboutPreviewData } from "@/data/home";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

export function AboutPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [settingsImg, setSettingsImg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json() as Promise<Record<string, string>>)
      .then((s) => { if (s.aboutPreviewImage) setSettingsImg(s.aboutPreviewImage); })
      .catch(() => {});
  }, []);

  const image = settingsImg || aboutPreviewData.image;

  return (
    <section ref={ref} className="max-w-5xl mx-auto px-5 py-24 md:py-32 max-md:py-16">
      {/* 标签 */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-3 mb-4"
      >
        <div className="h-px w-6" style={{ background: "var(--color-warm)" }} />
        <span className="text-[12px] font-medium tracking-[0.12em] uppercase" style={{ color: "var(--color-warm)" }}>
          {aboutPreviewData.label}
        </span>
      </motion.div>

      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={fadeUp}
      >
        <h2
          className="font-bold tracking-tight mb-10 leading-[1.1]"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-display-s)",
            color: "var(--color-ink)",
          }}
        >
          {aboutPreviewData.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="space-y-5 text-[16px] max-md:leading-[1.65] leading-relaxed" style={{ color: "var(--color-ink-2)" }}>
            <p
              className="text-[18px] font-semibold leading-snug"
              style={{ color: "var(--color-ink)" }}
            >
              {aboutPreviewData.highlight}
            </p>
            <p>{aboutPreviewData.description}</p>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 text-[15px] max-md:text-[17px] max-md:w-full font-medium transition-all duration-300 group max-md:py-3 max-md:px-5 max-md:rounded-xl max-md:bg-[var(--color-accent-light)] active:scale-[0.98]"
              style={{ color: "var(--color-accent)" }}
            >
              {aboutPreviewData.linkText}
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>

          <div className="relative">
            <div className="max-md:rounded-lg rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-500 aspect-[4/3] border"
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
        </div>
      </motion.div>
    </section>
  );
}
