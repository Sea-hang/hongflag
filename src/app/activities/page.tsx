"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { GlassNav } from "@/components/ui/GlassNav";
import { Footer } from "@/components/ui/Footer";
import { ActivityCard } from "@/components/ui/ActivityCard";
import { SearchInput } from "@/components/ui/SearchInput";

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

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "notice" | "news">("all");

  useEffect(() => {
    fetch("/api/activities")
      .then((r) => r.json() as Promise<Activity[]>)
      .then(setActivities);
  }, []);

  const filtered = useMemo(() => {
    let items = activities;
    if (activeTab !== "all") {
      items = items.filter((a) => a.type === activeTab);
    }
    if (search.trim()) {
      const keyword = search.toLowerCase();
      items = items.filter(
        (a) =>
          a.title.toLowerCase().includes(keyword) ||
          a.summary.toLowerCase().includes(keyword) ||
          a.tag?.toLowerCase().includes(keyword)
      );
    }
    return items;
  }, [activities, search, activeTab]);

  const topStory = filtered[0];
  const gridStories = filtered.slice(1);

  const notices = activities.filter((a) => a.type === "notice");
  const news = activities.filter((a) => a.type === "news");

  return (
    <>
      <GlassNav />
      <main className="pt-28 pb-16">
        {/* 顶部标题区 */}
        <section className="max-w-5xl mx-auto px-5 pt-8 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-[2px] w-6 rounded-full" style={{ background: "var(--color-warm)" }} />
              <span className="text-[12px] font-medium tracking-[0.12em] uppercase" style={{ color: "var(--color-warm)" }}>
                活动栏
              </span>
            </div>
            <h1
              className="text-[var(--text-display-s)] font-bold tracking-tight leading-[1.1] mb-2"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
            >
              新闻动态
            </h1>
          </motion.div>
        </section>

        {/* 搜索 + 分类标签 */}
        <section className="max-w-5xl mx-auto px-5 pb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="flex items-center justify-between max-md:flex-col max-md:items-start flex-wrap gap-4"
          >
            {/* 分类标签 */}
            <div className="flex items-center gap-1">
              {[
                { key: "all", label: "全部" },
                { key: "notice", label: `通知 (${notices.length})` },
                { key: "news", label: `新闻 (${news.length})` },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as "all" | "notice" | "news")}
                  className="relative text-[13px] max-md:text-[15px] max-md:px-5 max-md:py-2.5 px-4 py-1.5 rounded-full transition-all duration-200"
                  style={{
                    color: activeTab === tab.key ? "var(--color-accent)" : "var(--color-ink-2)",
                    background: activeTab === tab.key ? "var(--color-accent-light)" : "transparent",
                    fontWeight: activeTab === tab.key ? 600 : 400,
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="max-md:w-full"><SearchInput placeholder="搜索活动..." onSearch={setSearch} /></div>
          </motion.div>
        </section>

        {/* 内容区 */}
        <div className="max-w-5xl mx-auto px-5 pb-20">
          {filtered.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 text-[15px]"
              style={{ color: "var(--color-ink-3)" }}
            >
              没有找到匹配的活动
            </motion.p>
          ) : (
            <div className="space-y-12">
              {/* ===== 头条区 ===== */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
              >
                {topStory && (
                  <ActivityCard
                    type={topStory.type}
                    title={topStory.title}
                    date={topStory.date}
                    tag={topStory.tag}
                    tagColor={topStory.tagColor}
                    summary={topStory.summary}
                    image={topStory.image}
                    variant="hero"
                  />
                )}
              </motion.div>

              {/* ===== 网格区 ===== */}
              {gridStories.length > 0 && (
                <>
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1" style={{ background: "var(--color-rule)" }} />
                    <span className="text-[11px] font-bold tracking-[0.1em] uppercase flex-shrink-0" style={{ color: "var(--color-ink-3)" }}>
                      更多动态
                    </span>
                    <div className="h-px flex-1" style={{ background: "var(--color-rule)" }} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {gridStories.map((a, i) => (
                      <motion.div
                        key={a.id}
                        custom={i}
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                      >
                        <ActivityCard
                          type={a.type}
                          title={a.title}
                          date={a.date}
                          tag={a.tag}
                          tagColor={a.tagColor}
                          summary={a.summary}
                          image={a.image}
                          link={a.link}
                          variant="standard"
                        />
                      </motion.div>
                    ))}
                  </div>
                </>
              )}

              {/* ===== 通知公告区 ===== */}
              {notices.length > 0 && activeTab === "all" && (
                <>
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1" style={{ background: "var(--color-rule)" }} />
                    <span className="text-[11px] font-bold tracking-[0.1em] uppercase flex-shrink-0" style={{ color: "var(--color-accent)" }}>
                      通知公告
                    </span>
                    <div className="h-px flex-1" style={{ background: "var(--color-rule)" }} />
                  </div>
                  <div className="rounded-2xl max-md:p-4 p-6 divide-y"
                    style={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-rule)",
                      boxShadow: "0 2px 12px rgba(0, 0, 0, 0.04)",
                    }}
                  >
                    {notices.map((a, i) => (
                      <motion.div
                        key={a.id}
                        custom={i}
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                      >
                        <ActivityCard
                          type={a.type}
                          title={a.title}
                          date={a.date}
                          tag={a.tag}
                          tagColor={a.tagColor}
                          summary={a.summary}
                          image={a.image}
                          link={a.link}
                          variant="compact"
                        />
                      </motion.div>
                    ))}
                  </div>
                </>
              )}

              {/* ===== 全部新闻网格 ===== */}
              {news.length > 1 && activeTab === "all" && (
                <>
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1" style={{ background: "var(--color-rule)" }} />
                    <span className="text-[11px] font-bold tracking-[0.1em] uppercase flex-shrink-0" style={{ color: "var(--color-ink-3)" }}>
                      全部新闻
                    </span>
                    <div className="h-px flex-1" style={{ background: "var(--color-rule)" }} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {news.map((a, i) => (
                      <motion.div
                        key={a.id}
                        custom={i}
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                      >
                        <ActivityCard
                          type={a.type}
                          title={a.title}
                          date={a.date}
                          tag={a.tag}
                          tagColor={a.tagColor}
                          summary={a.summary}
                          image={a.image}
                          link={a.link}
                          variant="standard"
                        />
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
