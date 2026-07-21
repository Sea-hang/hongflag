"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { aboutPreviewData } from "@/data/home";

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
    <section ref={ref} className="max-w-5xl mx-auto px-5 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
      >
        <p className="text-[13px] font-medium text-[var(--accent)] tracking-wide mb-3">
          {aboutPreviewData.label}
        </p>
        <h2 className="text-[32px] md:text-[40px] font-bold tracking-tight text-[var(--text-primary)] mb-8">
          {aboutPreviewData.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4 text-[16px] text-[var(--text-secondary)] leading-relaxed">
            <p className="text-[var(--text-primary)] text-[19px] font-semibold leading-snug">
              {aboutPreviewData.highlight}
            </p>
            <p>{aboutPreviewData.description}</p>
            <Link
              href="/about"
              className="inline-block text-[var(--accent)] font-medium text-[15px] hover:opacity-70 transition-opacity mt-2"
            >
              {aboutPreviewData.linkText}
            </Link>
          </div>
          <div className="rounded-3xl aspect-square overflow-hidden hover:scale-[1.02] transition-transform duration-500 shadow-lg">
            {image ? (
              <img src={image} alt="学校照片" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-7xl">🏫</div>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
