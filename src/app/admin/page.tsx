"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GlassNav } from "@/components/ui/GlassNav";
import { Footer } from "@/components/ui/Footer";
import { NewtonCradle } from "@/components/ui/NewtonCradle";
import { useAuth } from "@/lib/auth";

interface Activity {
  id: string;
  type: "notice" | "news";
  title: string;
  date: string;
  tag?: string;
  tagColor?: string;
  summary: string;
  image?: string;
  link?: string;
}

export default function AdminPage() {
  const router = useRouter();
  const { isTeacher, isLoggedIn, getToken } = useAuth();
  const [checking, setChecking] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<"notice" | "news">("news");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [summary, setSummary] = useState("");
  const [tag, setTag] = useState("");
  const [tagColor, setTagColor] = useState<"red" | "orange" | "blue" | "green">("blue");
  const [activityImage, setActivityImage] = useState("");  // 图片 URL（不存 base64）
  const [activityLink, setActivityLink] = useState("");    // 微信原文链接
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // ===== 微信文章同步 =====
  const [wechatUrl, setWechatUrl] = useState("");
  const [fetching, setFetching] = useState(false);
  const [fetched, setFetched] = useState<{
    title: string;
    date: string;
    summary: string;
    images: string[];
    link: string;
  } | null>(null);
  const [selectedImage, setSelectedImage] = useState(""); // 选中的微信图片
  const [fetchError, setFetchError] = useState("");

  const [heroBgImage, setHeroBgImage] = useState("");
  const [aboutPreviewImage, setAboutPreviewImage] = useState("");
  const [aboutImage, setAboutImage] = useState("");
  const [contactMapImage, setContactMapImage] = useState("");
  const [settingsMsg, setSettingsMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [files, setFiles] = useState<{ name: string; path: string; size: number; isImage: boolean }[]>([]);
  const [activeField, setActiveField] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json() as Promise<Record<string, string>>)
      .then((s) => {
        if (s.heroBgImage) setHeroBgImage(s.heroBgImage);
        if (s.aboutPreviewImage) setAboutPreviewImage(s.aboutPreviewImage);
        if (s.aboutImage) setAboutImage(s.aboutImage);
        if (s.contactMapImage) setContactMapImage(s.contactMapImage);
      }).catch(() => {});
    fetch("/api/files")
      .then((r) => r.json() as Promise<{ name: string; path: string; size: number; isImage: boolean }[]>)
      .then(setFiles).catch(() => {});
  }, []);

  const handleSaveSettings = async () => {
    setSettingsMsg(null);
    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ heroBgImage, aboutPreviewImage, aboutImage, contactMapImage }),
    });
    const data = await res.json() as { success?: boolean; error?: string };
    setSettingsMsg(data.success ? { type: "ok", text: "图片设置已保存！" } : { type: "err", text: data.error || "保存失败" });
  };

  useEffect(() => { const t = setTimeout(() => setChecking(false), 200); return () => clearTimeout(t); }, []);
  useEffect(() => { if (!checking && !isLoggedIn) router.replace("/login"); }, [checking, isLoggedIn, router]);
  useEffect(() => { if (!checking && isLoggedIn && !isTeacher) router.replace("/"); }, [checking, isLoggedIn, isTeacher, router]);

  const fetchActivities = useCallback(async () => {
    const res = await fetch("/api/activities");
    setActivities((await res.json()) as Activity[]);
    setLoading(false);
  }, []);
  useEffect(() => { fetchActivities(); }, [fetchActivities]);

  // ===== 图片：粘贴 URL → 预览 =====
  const handleImageUrlChange = (url: string) => {
    setActivityImage(url);
  };

  // ===== 微信抓取 =====
  const handleFetchWechat = async () => {
    if (!wechatUrl.trim()) return;
    setFetching(true);
    setFetchError("");
    setFetched(null);
    setSelectedImage("");
    try {
      const res = await fetch("/api/fetch-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: wechatUrl.trim() }),
      });
      const data = (await res.json()) as {
        success?: boolean;
        error?: string;
        article?: { title: string; date: string; summary: string; images: string[]; link: string };
      };
      if (data.success && data.article) {
        setFetched(data.article);
        setSelectedImage(data.article.images[0] || "");
      } else {
        setFetchError(data.error || "抓取失败");
      }
    } catch {
      setFetchError("网络错误，请重试");
    }
    setFetching(false);
  };

  // 把抓取结果填入表单 — 图片直接用微信 URL，不下载
  const importToForm = () => {
    if (!fetched) return;
    setTitle(fetched.title);
    setDate(fetched.date);
    setSummary(fetched.summary);
    setType("news");
    if (selectedImage) setActivityImage(selectedImage);
    setActivityLink(fetched.link);
    setFetched(null);
    setWechatUrl("");
    setMsg({ type: "ok", text: "已填入表单，请检查后点击「添加活动」" });
  };

  const resetForm = () => {
    setTitle(""); setDate(""); setSummary(""); setTag("");
    setActivityImage(""); setActivityLink("");
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !summary) { setMsg({ type: "err", text: "请填写标题、日期和摘要" }); return; }
    setMsg(null);
    const body: Record<string, string> = { type, title, date, summary };
    if (tag) { body.tag = tag; body.tagColor = tagColor; }
    if (activityImage) { body.image = activityImage; }
    if (activityLink) { body.link = activityLink; }

    const res = await fetch("/api/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify(body),
    });
    const data = await res.json() as { success?: boolean; error?: string };
    if (data.success) {
      setMsg({ type: "ok", text: "活动已添加！" });
      resetForm();
      fetchActivities();
    } else { setMsg({ type: "err", text: data.error || "添加失败" }); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定删除吗？")) return;
    await fetch(`/api/activities/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } });
    fetchActivities(); setMsg({ type: "ok", text: "已删除" });
  };

  if (checking || !isTeacher) {
    return (
      <>
        <GlassNav />
        <main className="pt-24 pb-16">
          <div className="max-w-md mx-auto px-5 text-center pt-20">
            <div className="flex justify-center mb-6"><NewtonCradle /></div>
            <p className="text-[var(--text-secondary)] mt-4">验证身份中...</p>
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
        <div className="max-w-2xl mx-auto px-5">
          <h1 className="text-[28px] font-bold text-[var(--text-primary)] mb-3 text-center">📋 活动管理</h1>
          <p className="text-center mb-8">
            <a href="/guide" className="inline-flex items-center gap-1.5 text-[14px] text-[var(--accent)] hover:underline">📖 查看使用教程 →</a>
          </p>

          {/* ===== 微信同步 ===== */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-500/5 dark:to-emerald-500/5 rounded-3xl p-6 mb-6 border border-green-200 dark:border-green-500/15"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[22px]">📱</span>
              <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">同步微信文章</h2>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400 font-medium">无需认证</span>
            </div>
            <p className="text-[13px] text-[var(--text-secondary)] mb-4">
              粘贴学校公众号文章链接，自动提取标题、日期和内容
            </p>

            <div className="flex gap-3">
              <input
                value={wechatUrl}
                onChange={(e) => setWechatUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleFetchWechat()}
                placeholder="https://mp.weixin.qq.com/s/..."
                className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-green-500 transition-shadow"
              />
              <button
                onClick={handleFetchWechat}
                disabled={fetching || !wechatUrl.trim()}
                className="bg-green-600 text-white px-6 py-3 rounded-xl text-[14px] font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex-shrink-0 flex items-center gap-2"
              >
                {fetching ? (
                  <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />抓取中</>
                ) : (
                  <>🔍 抓取</>
                )}
              </button>
            </div>

            {fetchError && (
              <p className="text-[13px] text-red-500 mt-3">{fetchError}</p>
            )}

            {/* 抓取结果 */}
            {fetched && (
              <div className="mt-4 bg-[var(--bg-primary)] rounded-2xl p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[17px] font-bold text-[var(--text-primary)] leading-snug">{fetched.title}</h3>
                    <p className="text-[13px] text-[var(--text-secondary)] mt-1">{fetched.date} · 约 {fetched.summary.length} 字</p>
                  </div>
                  <button
                    onClick={() => { setFetched(null); setFetchError(""); }}
                    className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors text-[18px] ml-3 flex-shrink-0"
                  >✕</button>
                </div>

                <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed line-clamp-3">{fetched.summary}</p>

                {/* 图片选择 */}
                {fetched.images.length > 0 && (
                  <div>
                    <p className="text-[12px] font-medium text-[var(--text-secondary)] mb-2">
                      🖼️ 文章中的图片（{fetched.images.length} 张，点击选择作为封面）
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {fetched.images.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedImage(img)}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImage === img
                              ? "border-green-500 ring-2 ring-green-200"
                              : "border-transparent hover:border-[var(--border)]"
                          }`}
                        >
                          <img src={img} alt={`图${i + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={importToForm}
                  className="w-full bg-green-600 text-white text-[15px] font-semibold py-3 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  ⬇️ 导入到下方表单
                </button>
              </div>
            )}
          </motion.div>

          {/* ===== 添加活动 ===== */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--bg-secondary)] rounded-3xl p-6 mb-10"
          >
            <h2 className="text-[18px] font-semibold text-[var(--text-primary)] mb-5">➕ 添加新活动</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              {/* 类型切换 */}
              <div className="flex gap-3">
                {(["news", "notice"] as const).map((t) => (
                  <button key={t} type="button" onClick={() => setType(t)}
                    className={`flex-1 py-2.5 rounded-xl text-[14px] font-medium transition-colors ${
                      type === t ? "bg-[var(--accent)] text-white" : "bg-[var(--bg-primary)] text-[var(--text-secondary)]"
                    }`}
                  >{t === "news" ? "📰 新闻" : "📢 通知"}</button>
                ))}
              </div>

              {/* 标题 */}
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="标题 *"
                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[var(--accent)]" />

              {/* 日期 + 标签同行 */}
              <div className="flex gap-3">
                <input value={date} onChange={(e) => setDate(e.target.value)} placeholder="日期，如 07-08 *"
                  className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[var(--accent)]" />
                {type === "notice" && (
                  <>
                    <input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="标签"
                      className="w-28 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-3 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[var(--accent)]" />
                    <select value={tagColor} onChange={(e) => setTagColor(e.target.value as typeof tagColor)}
                      className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-3 py-3 text-[14px] outline-none">
                      <option value="red">红</option><option value="orange">橙</option><option value="blue">蓝</option><option value="green">绿</option>
                    </select>
                  </>
                )}
                {type === "news" && (
                  <>
                    <input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="标签（可选）"
                      className="w-28 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-3 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[var(--accent)]" />
                    <select value={tagColor} onChange={(e) => setTagColor(e.target.value as typeof tagColor)}
                      className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-3 py-3 text-[14px] outline-none">
                      <option value="red">红</option><option value="orange">橙</option><option value="blue">蓝</option><option value="green">绿</option>
                    </select>
                  </>
                )}
              </div>

              {/* 摘要 */}
              <textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="摘要 *" rows={3}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none" />

              {/* ===== 图片 URL（不占存储）===== */}
              <div>
                <p className="text-[13px] font-medium text-[var(--text-secondary)] mb-2">
                  🖼️ 配图链接（可选，不占网站存储）
                </p>

                <div className="flex gap-2">
                  <input
                    value={activityImage}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                    placeholder="粘贴图片链接，如 https://mmbiz.qpic.cn/..."
                    className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                  {activityImage && (
                    <button type="button" onClick={() => setActivityImage("")}
                      className="text-[var(--text-tertiary)] hover:text-red-500 px-2 transition-colors text-[20px]">✕</button>
                  )}
                </div>

                {activityImage && (
                  <div className="mt-2 rounded-xl overflow-hidden bg-[var(--bg-primary)] border border-[var(--border)]">
                    <img src={activityImage} alt="预览" className="w-full h-40 object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </div>
                )}

                <p className="text-[11px] text-[var(--text-tertiary)] mt-1.5">
                  💡 只存链接不存图，不占空间。推荐用微信图片链接（从上方「同步微信文章」获取）
                </p>
              </div>

              {/* 提交 */}
              <button type="submit"
                className="w-full bg-[var(--accent)] text-white text-[15px] font-medium py-3.5 rounded-full hover:bg-[var(--accent-hover)] transition-colors shadow-sm"
              >添加活动</button>
            </form>

            {msg && (
              <div className={`mt-4 p-4 rounded-xl text-[14px] ${
                msg.type === "ok" ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400" : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
              }`}>{msg.text}</div>
            )}
          </motion.div>

          {/* ===== 图片设置 ===== */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-[var(--bg-secondary)] rounded-3xl p-6 mb-10"
          >
            <h2 className="text-[18px] font-semibold text-[var(--text-primary)] mb-5">🖼️ 图片设置</h2>
            <p className="text-[13px] text-[var(--text-tertiary)] mb-4">把图片放到 public/uploads/activities/ 文件夹，然后在下方填写路径。留空则使用默认样式。</p>
            {files.length > 0 && (
              <div className="mb-5 bg-[var(--bg-primary)] rounded-xl p-3 max-h-48 overflow-y-auto">
                <p className="text-[12px] font-medium text-[var(--text-secondary)] mb-2">📁 本地文件</p>
                <div className="space-y-1">
                  {files.map((f) => (
                    <button key={f.name} type="button"
                      onClick={() => {
                        if (activeField === "hero") setHeroBgImage(f.path);
                        else if (activeField === "aboutPreview") setAboutPreviewImage(f.path);
                        else if (activeField === "about") setAboutImage(f.path);
                        else if (activeField === "contactMap") setContactMapImage(f.path);
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors text-left group"
                    >
                      <span className="text-[16px]">{f.isImage ? "🖼️" : "📄"}</span>
                      <span className="text-[13px] text-[var(--text-primary)] truncate flex-1">{f.name}</span>
                      <span className="text-[11px] text-[var(--text-tertiary)] flex-shrink-0">{(f.size / 1024).toFixed(0)}KB</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-4">
              {[
                { key: "hero", label: "Hero 背景图", value: heroBgImage, set: setHeroBgImage },
                { key: "aboutPreview", label: "首页 — 学校照片", value: aboutPreviewImage, set: setAboutPreviewImage },
                { key: "about", label: "学校简介页 — 照片", value: aboutImage, set: setAboutImage },
                { key: "contactMap", label: "联系方式页 — 地图照片", value: contactMapImage, set: setContactMapImage },
              ].map(({ key, label, value, set }) => (
                <div key={key}>
                  <label className="text-[13px] font-medium text-[var(--text-secondary)] mb-1.5 block">{label}</label>
                  <div className="flex gap-3 items-center">
                    <input value={value} onChange={(e) => set(e.target.value)} placeholder="如 /uploads/activities/bg.jpg"
                      className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[14px] outline-none focus:ring-2 focus:ring-[var(--accent)]" />
                    {value ? <img src={value} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      : <div className="w-10 h-10 rounded-lg bg-[var(--bg-primary)] flex items-center justify-center text-[18px] flex-shrink-0">🖼️</div>}
                    <button type="button" onClick={() => setActiveField(key)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                        activeField === key ? "bg-[var(--accent)] text-white" : "bg-[var(--bg-primary)] hover:bg-[var(--bg-secondary)]"
                      }`}>📌</button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={handleSaveSettings}
              className="w-full bg-[var(--accent)] text-white text-[15px] font-medium py-3.5 rounded-full hover:bg-[var(--accent-hover)] transition-colors shadow-sm mt-5"
            >保存图片设置</button>
            {settingsMsg && (
              <div className={`mt-4 p-4 rounded-xl text-[14px] ${
                settingsMsg.type === "ok" ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400" : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
              }`}>{settingsMsg.text}</div>
            )}
          </motion.div>

          {/* ===== 活动列表 ===== */}
          <h2 className="text-[18px] font-semibold text-[var(--text-primary)] mb-4">已有活动（{activities.length}）</h2>
          {loading ? (
            <div className="flex justify-center py-10"><NewtonCradle /></div>
          ) : (
            <div className="space-y-2">
              {activities.map((a) => (
                <div key={a.id} className="flex items-start gap-3 bg-[var(--bg-secondary)] rounded-xl px-4 py-3 group">
                  {a.image && (
                    <img src={a.image} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] px-1.5 py-0.5 rounded font-medium ${
                        a.type === "news" ? "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" : "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
                      }`}>{a.type === "news" ? "新闻" : "通知"}</span>
                      <span className="text-[13px] font-medium text-[var(--text-primary)] truncate">{a.title}</span>
                    </div>
                    <p className="text-[12px] text-[var(--text-tertiary)] mt-0.5">{a.date} — {a.summary}</p>
                  </div>
                  <button onClick={() => handleDelete(a.id)}
                    className="flex-shrink-0 text-[12px] text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1"
                  >🗑</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
