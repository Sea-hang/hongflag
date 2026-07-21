"use client";

import Link from "next/link";
import { site } from "@/data/site";
import { useAuth } from "@/lib/auth";

export function Footer() {
  const { isLoggedIn, isTeacher, logout } = useAuth();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-secondary)] mt-24">
      <div className="max-w-5xl mx-auto px-5 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-[13px]">
          <div>
            <h3 className="text-[15px] font-semibold text-[var(--text-primary)] mb-3">{site.name}</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              {site.footer.schoolDesc}<br />{site.location}
            </p>
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-[var(--text-primary)] mb-3">{site.footer.quickLinksTitle}</h3>
            <ul className="space-y-1.5">
              {site.navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-200">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-[var(--text-primary)] mb-3">{site.footer.contactTitle}</h3>
            <ul className="space-y-1.5 text-[var(--text-secondary)]">
              <li>📍 {site.address}</li>
              <li>📞 {site.phone}</li>
              <li>📧 {site.email}</li>
            </ul>
            <div className="mt-4 pt-4 border-t border-[var(--border)]">
              {isLoggedIn ? (
                <div className="flex items-center gap-2 text-[12px]">
                  <span className="text-[var(--text-tertiary)]">{isTeacher ? "👩‍🏫 教师" : "🎒 已登录"}</span>
                  {isTeacher && (
                    <Link href="/admin" className="text-[var(--accent)] hover:underline font-medium">管理后台</Link>
                  )}
                  <button onClick={logout} className="text-[var(--text-tertiary)] hover:text-red-500 transition-colors ml-auto">退出</button>
                </div>
              ) : (
                <Link href="/login" className="text-[12px] text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors">🔑 身份登录</Link>
              )}
            </div>
          </div>
        </div>
        <div className="border-t border-[var(--border)] mt-8 pt-5 text-[12px] text-[var(--text-tertiary)]">{site.copyright}</div>
      </div>
    </footer>
  );
}
