"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GlassNav } from "@/components/ui/GlassNav";
import { Footer } from "@/components/ui/Footer";
import { NewtonCradle } from "@/components/ui/NewtonCradle";
import { useAuth, type Role } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoggedIn, role: currentRole, logout } = useAuth();
  const [step, setStep] = useState<"choose" | "teacher">("choose");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (r: Role) => {
    if (r === "teacher") {
      setStep("teacher");
      setError("");
      setPassword("");
    } else {
      login(r);
      router.push("/");
    }
  };

  const handleTeacherLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const ok = await login("teacher", password);
    if (ok) {
      router.push("/admin");
    } else {
      setError("密码错误，请重试");
      setLoading(false);
    }
  };

  if (isLoggedIn) {
    return (
      <>
        <GlassNav />
        <main className="pt-24 pb-16">
          <div className="max-w-md mx-auto px-5 text-center pt-20">
            <p className="text-[48px] mb-6">👋</p>
            <h1 className="text-[24px] font-bold text-[var(--text-primary)] mb-3">你已登录</h1>
            <p className="text-[var(--text-secondary)] mb-2">
              当前身份：<strong>{currentRole === "teacher" ? "👩‍🏫 教师" : currentRole === "student" ? "🎒 学生" : "👨‍👩‍👧 家长"}</strong>
            </p>
            {currentRole === "teacher" && (
              <p className="text-[var(--text-secondary)] mb-6">拥有全部管理权限</p>
            )}
            <div className="flex flex-col gap-3 mt-6">
              {currentRole === "teacher" && (
                <button
                  onClick={() => router.push("/admin")}
                  className="w-full bg-[var(--accent)] text-white font-medium py-3 rounded-full hover:bg-[var(--accent-hover)] transition-colors"
                >进入管理后台</button>
              )}
              <button
                onClick={() => router.push("/")}
                className="w-full bg-[var(--bg-secondary)] text-[var(--text-primary)] font-medium py-3 rounded-full hover:bg-[var(--bg-tertiary)] transition-colors"
              >返回首页</button>
              <button
                onClick={logout}
                className="w-full text-[var(--text-tertiary)] text-[14px] py-2 hover:text-red-500 transition-colors"
              >退出登录</button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <GlassNav />
      <main className="pt-24 pb-16">
        <div className="max-w-md mx-auto px-5 pt-12">
          <h1 className="text-[28px] font-bold text-[var(--text-primary)] text-center mb-3">选择你的身份</h1>
          <p className="text-[15px] text-[var(--text-secondary)] text-center mb-10">不同身份对应不同的功能权限</p>

          {step === "choose" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              {[
                { role: "student" as const, icon: "🎒", title: "我是学生", desc: "查看学校动态、活动信息" },
                { role: "parent" as const, icon: "👨‍👩‍👧", title: "我是家长", desc: "查看学校动态、活动信息" },
                { role: "teacher" as const, icon: "👩‍🏫", title: "我是教师", desc: "管理活动、上传图片等全部功能", locked: true },
              ].map((item) => (
                <button
                  key={item.role}
                  onClick={() => handleRoleSelect(item.role)}
                  className="w-full flex items-center gap-4 bg-[var(--bg-secondary)] rounded-2xl px-5 py-4 hover:bg-[var(--bg-tertiary)] transition-colors text-left group"
                >
                  <span className="text-[32px]">{item.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[16px] font-semibold text-[var(--text-primary)]">{item.title}</span>
                      {item.locked && (
                        <span className="text-[11px] px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400">需要密码</span>
                      )}
                    </div>
                    <span className="text-[13px] text-[var(--text-secondary)]">{item.desc}</span>
                  </div>
                  <span className="text-[var(--text-tertiary)] group-hover:translate-x-1 transition-transform">→</span>
                </button>
              ))}
            </motion.div>
          )}

          {step === "teacher" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[var(--bg-secondary)] rounded-3xl p-8">
              {loading ? (
                <div className="text-center py-8">
                  <div className="flex justify-center mb-6"><NewtonCradle /></div>
                  <h2 className="text-[20px] font-semibold text-[var(--text-primary)]">正在验证...</h2>
                  <p className="text-[14px] text-[var(--text-secondary)] mt-2">密码验证中，请稍候</p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <span className="text-[48px]">👩‍🏫</span>
                    <h2 className="text-[20px] font-semibold text-[var(--text-primary)] mt-3">教师验证</h2>
                    <p className="text-[14px] text-[var(--text-secondary)] mt-1">请输入教师密码进入管理后台</p>
                  </div>
                  <form onSubmit={handleTeacherLogin} className="space-y-4">
                    <input
                      type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="请输入教师密码" autoFocus disabled={loading}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[var(--accent)] transition-shadow"
                    />
                    {error && <p className="text-[14px] text-red-500 text-center">{error}</p>}
                    <button type="submit" disabled={loading}
                      className="w-full bg-[var(--accent)] text-white font-medium py-3.5 rounded-full hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
                    >验证进入</button>
                    <button type="button" disabled={loading}
                      onClick={() => { setStep("choose"); setError(""); setPassword(""); }}
                      className="w-full text-[var(--text-tertiary)] text-[14px] py-2 hover:text-[var(--text-primary)] transition-colors"
                    >← 返回选择身份</button>
                  </form>
                  <p className="text-center text-[12px] text-[var(--text-tertiary)] mt-4">教师密码请向学校管理员获取</p>
                </>
              )}
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
