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
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
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
      <main className="pt-24 pb-16">
        <section className="max-w-5xl mx-auto px-5 pt-12 pb-10 text-center">
          <motion.p
            custom={0} initial="hidden" animate="visible" variants={fadeUp}
            className="text-[13px] font-medium text-[var(--accent)] tracking-wide mb-3"
          >
            {contactData.label}
          </motion.p>
          <motion.h1
            custom={1} initial="hidden" animate="visible" variants={fadeUp}
            className="text-[36px] md:text-[48px] font-bold tracking-tight text-[var(--text-primary)]"
          >
            {contactData.title}
          </motion.h1>
        </section>

        <section className="max-w-5xl mx-auto px-5 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact info */}
            <div className="space-y-6">
              {contacts.map((item, i) => (
                <motion.div
                  key={item.label}
                  custom={i + 2}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  className="flex items-start gap-4"
                >
                  <div className={`w-11 h-11 ${item.color} rounded-xl flex items-center justify-center text-lg flex-shrink-0`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--text-primary)] text-[15px]">
                      {item.label}
                    </h3>
                    <p className="text-[14px] text-[var(--text-secondary)] mt-0.5 whitespace-pre-line">
                      {item.value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Map / School image */}
            <motion.div
              custom={6}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="bg-[var(--bg-secondary)] rounded-3xl min-h-[320px] overflow-hidden"
            >
              {mapImage ? (
                <img
                  src={mapImage}
                  alt="学校位置"
                  className="w-full h-full object-cover min-h-[320px]"
                />
              ) : (
                <div className="w-full h-full min-h-[320px] flex items-center justify-center">
                  <div className="text-center text-[var(--text-secondary)]">
                    <div className="text-5xl mb-4">🗺️</div>
                    <p className="text-[15px] font-medium text-[var(--text-primary)]">{contactData.mapTitle}</p>
                    <p className="text-[13px] mt-1">{contactData.mapCity}</p>
                    <p className="text-[13px]">{contactData.mapStreet}</p>
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
