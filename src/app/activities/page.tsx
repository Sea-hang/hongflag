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
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/activities")
      .then((r) => r.json() as Promise<Activity[]>)
      .then(setActivities);
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return activities;
    const keyword = search.toLowerCase();
    return activities.filter(
      (a) =>
        a.title.toLowerCase().includes(keyword) ||
        a.summary.toLowerCase().includes(keyword) ||
        a.tag?.toLowerCase().includes(keyword)
    );
  }, [activities, search]);

  // Apple News 式分组
  const topStory = filtered[0];
  const secondaryLead = filtered[1];
  const gridStories = filtered.slice(2, 6);
  const compactStories = filtered.slice(6);

  const notices = filtered.filter((a) => a.type === "notice");
  const news = filtered.filter((a) => a.type === "news");

  return (
    <>
      <GlassNav />
      <main className="pt-20 pb-16">
        {/* 顶部标题栏 */}
        <section className="max-w-5xl mx-auto px-5 pt-8 pb-6">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-[var(--accent)] mb-1">
                活动栏
              </p>
              <h1 className="text-[36px] md:text-[48px] font-extrabold tracking-[-0.02em] leading-[1.05] text-[var(--text-primary)]">
                新闻动态
              </h1>
            </div>
            <SearchInput placeholder="搜索活动..." onSearch={setSearch} />
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-5 pb-20">
          {filtered.length === 0 ? (
            <p className="text-[var(--text-tertiary)] text-center py-20 text-[15px]">没有找到匹配的活动</p>
          ) : (
            <div className="space-y-12">
              {/* ===== 头条区 ===== */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* 主头条 — 占 2/3 */}
                {topStory && (
                  <motion.div
                    custom={0} initial="hidden" animate="visible" variants={fadeUp}
                    className="lg:col-span-2"
                  >
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
                  </motion.div>
                )}

                {/* 右侧次要头条列表 */}
                <div className="flex flex-col gap-4">
                  {secondaryLead && (
                    <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp}>
                      <ActivityCard
                        type={secondaryLead.type}
                        title={secondaryLead.title}
                        date={secondaryLead.date}
                        tag={secondaryLead.tag}
                        tagColor={secondaryLead.tagColor}
                        summary={secondaryLead.summary}
                        image={secondaryLead.image}
                        variant="standard"
                      />
                    </motion.div>
                  )}
                  {/* 紧凑列表 */}
                  {compactStories.slice(0, 3).map((a, i) => (
                    <motion.div
                      key={a.id}
                      custom={i + 2}
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
              </div>

              {/* ===== 网格区 ===== */}
              {gridStories.length > 0 && (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-[2px] flex-1 bg-[var(--border)]" />
                    <span className="text-[11px] font-bold tracking-[0.1em] uppercase text-[var(--text-tertiary)] flex-shrink-0">
                      更多动态
                    </span>
                    <div className="h-[2px] flex-1 bg-[var(--border)]" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {gridStories.map((a, i) => (
                      <motion.div
                        key={a.id}
                        custom={i + 6}
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
              {notices.length > 0 && (
                <>
                  <div className="flex items-center gap-3">
                    <div className="h-[2px] flex-1 bg-[var(--border)]" />
                    <span className="text-[11px] font-bold tracking-[0.1em] uppercase text-[var(--accent)] flex-shrink-0">
                      通知公告
                    </span>
                    <div className="h-[2px] flex-1 bg-[var(--border)]" />
                  </div>
                  <div className="bg-[var(--bg-secondary)] rounded-2xl p-5 divide-y divide-[var(--border)]">
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
              {news.length > 1 && (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-[2px] flex-1 bg-[var(--border)]" />
                    <span className="text-[11px] font-bold tracking-[0.1em] uppercase text-[var(--text-tertiary)] flex-shrink-0">
                      全部新闻
                    </span>
                    <div className="h-[2px] flex-1 bg-[var(--border)]" />
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
