"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
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

const child = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function ActivitiesPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [items, setItems] = useState<Activity[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/activities")
      .then((r) => r.json() as Promise<Activity[]>)
      .then((data) => setItems(data.slice(0, 5)));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const keyword = search.toLowerCase();
    return items.filter(
      (a) =>
        a.title.toLowerCase().includes(keyword) ||
        a.summary.toLowerCase().includes(keyword) ||
        a.tag?.toLowerCase().includes(keyword)
    );
  }, [items, search]);

  const hero = filtered[0];
  const rest = filtered.slice(1);

  return (
    <section ref={ref} className="py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-5">
        {/* 标题栏 — Apple News 风格 */}
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-[var(--accent)] mb-2">
              最新动态
            </p>
            <h2 className="text-[32px] md:text-[40px] font-extrabold tracking-[-0.02em] leading-[1.1] text-[var(--text-primary)]">
              活动栏
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <SearchInput placeholder="搜索..." onSearch={setSearch} />
            <Link href="/activities" className="text-[14px] text-[var(--accent)] font-semibold hover:opacity-70 transition-opacity flex-shrink-0">
              查看全部 →
            </Link>
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-[var(--text-tertiary)] text-center py-20 text-[15px]">没有找到匹配的活动</p>
        ) : (
          <div className="space-y-10">
            {/* Hero 头条 */}
            {hero && (
              <motion.div
                custom={0} initial="hidden" animate={inView ? "visible" : "hidden"} variants={child}
              >
                <ActivityCard
                  type={hero.type}
                  title={hero.title}
                  date={hero.date}
                  tag={hero.tag}
                  tagColor={hero.tagColor}
                  summary={hero.summary}
                  image={hero.image}
                  link={hero.link}
                  variant="hero"
                />
              </motion.div>
            )}

            {/* 次级卡片网格 */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {rest.map((a, i) => (
                  <motion.div
                    key={a.id}
                    custom={i + 1}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={child}
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
            )}
          </div>
        )}
      </div>
    </section>
  );
}
