"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { site } from "@/data/site";
import { useAuth } from "@/lib/auth";

export function Footer() {
  const { isLoggedIn, isTeacher, logout } = useAuth();

  return (
    <footer className="relative mt-32">
      {/* SVG 曲线分隔线 — Braindrop 灵感 */}
      <div className="relative max-md:h-12 h-16 md:h-24 overflow-hidden" style={{ background: "var(--color-paper)" }}>
        <svg
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          className="absolute bottom-0 w-full h-full"
          style={{ color: "var(--color-accent-deep)" }}
        >
          <path
            d="M0,40 C240,100 480,0 720,40 C960,80 1200,0 1440,40 L1440,100 L0,100 Z"
            fill="currentColor"
            opacity="0.05"
          />
          <path
            d="M0,50 C360,110 720,10 1080,50 C1260,70 1350,40 1440,50 L1440,100 L0,100 Z"
            fill="var(--color-accent-deep)"
          />
        </svg>
      </div>

      {/* 深紫色背景区域 */}
      <div style={{ background: "var(--color-accent-deep)" }}>
        <div className="max-w-5xl mx-auto px-5 py-16">
          {/* 校训 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-14"
          >
            <p className="max-md:text-lg text-xl md:text-2xl font-bold tracking-wide text-white" style={{ fontFamily: "var(--font-display)" }}>
              "厚德博学 · 求实创新"
            </p>
            <p className="text-[13px] mt-2 tracking-widest text-white/50">
              — 校 训 —
            </p>
          </motion.div>

          {/* 三栏 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 text-[14px] text-white/80">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3 className="text-[16px] font-bold text-white mb-3 tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                {site.name}
              </h3>
              <p className="text-white/60 leading-relaxed">
                {site.footer.schoolDesc}
                <br />
                {site.location}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3 className="text-[16px] font-bold text-white mb-3 tracking-tight">
                {site.footer.quickLinksTitle}
              </h3>
              <ul className="space-y-2">
                {site.navLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}
                      className="text-white/60 hover:text-white transition-colors duration-200 relative inline-block
                        after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-white
                        after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3 className="text-[16px] font-bold text-white mb-3 tracking-tight">
                {site.footer.contactTitle}
              </h3>
              <ul className="space-y-2 text-white/60">
                <li className="flex items-start gap-2">
                  <span className="opacity-70 flex-shrink-0">📍</span>
                  <span>{site.address}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="opacity-70 flex-shrink-0">📞</span>
                  <span>{site.phone}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="opacity-70 flex-shrink-0">📧</span>
                  <span>{site.email}</span>
                </li>
              </ul>

              <div className="mt-6 pt-4 border-t border-white/10">
                {isLoggedIn ? (
                  <div className="flex items-center gap-2 text-[12px] text-white/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    <span>{isTeacher ? "教师" : "已登录"}</span>
                    {isTeacher && (
                      <Link href="/admin" className="text-white/80 hover:text-white font-medium ml-auto">
                        管理后台
                      </Link>
                    )}
                    <button onClick={logout} className="hover:text-white transition-colors ml-auto">
                      退出
                    </button>
                  </div>
                ) : (
                  <Link href="/login" className="text-[12px] text-white/50 hover:text-white transition-colors inline-flex items-center gap-1">
                    <span>🔑</span>
                    <span className="hover:underline">身份登录</span>
                  </Link>
                )}
              </div>
            </motion.div>
          </div>

          {/* 版权 */}
          <div className="border-t border-white/10 mt-12 pt-6 text-[12px] text-white/40 text-center">
            {site.copyright}
          </div>
          <p className="mt-3 text-[11px] text-white/30 text-center leading-relaxed">
            😁感谢学校提供的素材和支持，感谢 Sea_hang 的技术支持，特别鸣谢：闫同学
          </p>
        </div>
      </div>
    </footer>
  );
}
