"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassNav } from "@/components/ui/GlassNav";
import { Footer } from "@/components/ui/Footer";
import { contactData } from "@/data/contact";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const contacts = contactData.contacts;

export default function ContactPage() {
  const [settingsImg, setSettingsImg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json() as Promise<Record<string, string>>)
      .then((s) => { if (s.contactMapImage) setSettingsImg(s.contactMapImage); })
      .catch(() => {});
  }, []);

  const mapImage = settingsImg || contactData.mapImage;

  return (
    <>
      <GlassNav />
      <main className="pt-28 pb-16">
        {/* ===== 信笺式头部 ===== */}
        <section className="max-w-3xl mx-auto px-5 pt-16 pb-6">
          <motion.div
            custom={0} initial="hidden" animate="visible" variants={fadeUp}
            className="flex items-center gap-3 mb-4"
          >
            <div className="h-[2px] w-6 rounded-full" style={{ background: "var(--color-warm)" }} />
            <span className="text-[12px] font-medium tracking-[0.12em] uppercase" style={{ color: "var(--color-warm)" }}>
              {contactData.label}
            </span>
          </motion.div>

          <motion.h1
            custom={1} initial="hidden" animate="visible" variants={fadeUp}
            className="text-[var(--text-display-s)] font-bold tracking-tight leading-[1.1] mb-4"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
          >
            {contactData.title}
          </motion.h1>

          {/* 信笺问候语 */}
          <motion.div
            custom={2} initial="hidden" animate="visible" variants={fadeUp}
            className="mt-8 p-6 rounded-2xl border-l-4"
            style={{
              background: "var(--color-paper-2)",
              borderColor: "var(--color-warm)",
            }}
          >
            <p className="text-[15px] leading-relaxed" style={{ color: "var(--color-ink-2)" }}>
              如有任何疑问或建议，欢迎通过以下方式与我们取得联系。
              学校全体教职工将竭诚为您服务。
            </p>
          </motion.div>
        </section>

        {/* ===== 联系信息 + 地图 ===== */}
        <section className="max-w-5xl mx-auto px-5 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            {/* 联系信息 */}
            <div className="space-y-6">
              {contacts.map((item, i) => (
                <motion.div
                  key={item.label}
                  custom={i + 3}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  className="flex items-start gap-4 group"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-lg flex-shrink-0 transition-colors duration-300"
                    style={{
                      background: "var(--color-accent-light)",
                      color: "var(--color-accent)",
                    }}
                  >
                    {item.icon}
                  </div>
                  <div className="pt-1">
                    <h3
                      className="font-bold text-[15px] mb-1"
                      style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)" }}
                    >
                      {item.label}
                    </h3>
                    <p className="text-[14px] whitespace-pre-line leading-relaxed"
                      style={{ color: "var(--color-ink-2)" }}
                    >
                      {item.value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 地图/学校图片 */}
            <motion.div
              custom={8}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="rounded-2xl overflow-hidden border min-h-[360px]"
              style={{
                borderColor: "var(--color-rule)",
                background: "var(--color-paper-2)",
              }}
            >
              {mapImage ? (
                <img
                  src={mapImage}
                  alt="学校位置"
                  className="w-full h-full object-cover min-h-[360px] transition-transform duration-700 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full min-h-[360px] flex items-center justify-center">
                  <div className="text-center px-6">
                    <div className="text-5xl mb-4 opacity-60">🏫</div>
                    <h4 className="text-[16px] font-bold mb-2"
                      style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)" }}
                    >
                      {contactData.mapTitle}
                    </h4>
                    <p className="text-[14px]" style={{ color: "var(--color-ink-2)" }}>
                      {contactData.mapCity}
                    </p>
                    <p className="text-[14px]" style={{ color: "var(--color-ink-2)" }}>
                      {contactData.mapStreet}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
