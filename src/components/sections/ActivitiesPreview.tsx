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

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
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
      .then((data) => setItems(data.slice(0, 5)))
      .catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const keyword = search.toLowerCase();
    return items.filter(
      (a) => a.title.toLowerCase().includes(keyword) ||
        a.summary.toLowerCase().includes(keyword) ||
        a.tag?.toLowerCase().includes(keyword)
    );
  }, [items, search]);

  const hero = filtered[0];
  const rest = filtered.slice(1);

  return (
    <section ref={ref} className="py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-5">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-end justify-between mb-12 flex-wrap gap-4"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-6" style={{ background: "var(--color-accent)" }} />
              <span className="text-[12px] font-medium tracking-[0.12em] uppercase" style={{ color: "var(--color-accent)" }}>
                最新动态
              </span>
            </div>
            <h2
              className="font-bold tracking-tight leading-[1.1]"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-display-s)",
                color: "var(--color-ink)",
              }}
            >
              活动栏
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <SearchInput placeholder="搜索活动..." onSearch={setSearch} />
            <Link
              href="/activities"
              className="text-[14px] font-medium transition-all duration-300 hover:translate-x-0.5 hidden sm:inline-flex items-center gap-1"
              style={{ color: "var(--color-accent)" }}
            >
              查看全部 <span>→</span>
            </Link>
          </div>
        </motion.div>

        {filtered.length === 0 ? (
          <p className="text-center py-20 text-[15px]" style={{ color: "var(--color-ink-3)" }}>
            没有找到匹配的活动
          </p>
        ) : (
          <div className="space-y-10">
            {hero && (
              <motion.div custom={0} initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp}>
                <ActivityCard type={hero.type} title={hero.title} date={hero.date}
                  tag={hero.tag} tagColor={hero.tagColor} summary={hero.summary}
                  image={hero.image} link={hero.link} variant="hero"
                />
              </motion.div>
            )}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {rest.map((a, i) => (
                  <motion.div key={a.id} custom={i + 1} initial="hidden"
                    animate={inView ? "visible" : "hidden"} variants={fadeUp}
                  >
                    <ActivityCard type={a.type} title={a.title} date={a.date}
                      tag={a.tag} tagColor={a.tagColor} summary={a.summary}
                      image={a.image} link={a.link} variant="standard"
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mt-10 sm:hidden"
        >
          <Link href="/activities" className="inline-flex items-center gap-2 text-[14px] font-medium transition-all duration-300"
            style={{ color: "var(--color-accent)" }}
          >
            查看全部活动 <span>→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
