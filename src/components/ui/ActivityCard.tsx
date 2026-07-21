"use client";

import { motion } from "framer-motion";

// 微信图片自动走代理（绕过防盗链）
function imgSrc(url: string): string {
  if (/mmbiz\.qpic\.cn|mmbiz\.qlogo\.cn/.test(url) && !url.startsWith("/api/img")) {
    return `/api/img?url=${encodeURIComponent(url)}`;
  }
  return url;
}

interface ActivityCardProps {
  type: "news" | "notice";
  title: string;
  date: string;
  summary?: string;
  tag?: string;
  tagColor?: string;
  image?: string;
  link?: string;
  variant?: "hero" | "standard" | "compact";
}

export function ActivityCard({
  title,
  date,
  summary,
  tag,
  image,
  link,
  variant = "standard",
}: ActivityCardProps) {
  const href = link || "#";
  const isExternal = link && /^https?:\/\//.test(link);
  // Hero: 大图 + 文字叠在图上
  if (variant === "hero") {
    return (
      <motion.a
        href={href} {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        whileHover={{ scale: 1.01 }}
        className="relative block w-full rounded-2xl overflow-hidden group cursor-pointer"
        style={{ minHeight: "380px" }}
      >
        {image ? (
          <img src={imgSrc(image)} alt={title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          {tag && (
            <span className="inline-block text-[11px] font-bold tracking-[0.08em] uppercase text-white/90 mb-2">
              {tag}
            </span>
          )}
          <h3 className="text-[24px] md:text-[32px] font-bold leading-[1.15] text-white mb-2 tracking-[-0.01em]">
            {title}
          </h3>
          {summary && (
            <p className="text-[15px] text-white/75 leading-relaxed line-clamp-2 max-w-lg">{summary}</p>
          )}
          <span className="inline-block text-[11px] text-white/60 mt-3 font-medium">{date}</span>
        </div>
      </motion.a>
    );
  }

  // Compact: 纯文字、小卡片
  if (variant === "compact") {
    return (
      <motion.a
        href={href} {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        whileHover={{ x: 2 }}
        className="flex items-start gap-3 py-3 group border-b border-[var(--border)] last:border-0"
      >
        <div className="flex-1 min-w-0">
          {tag && (
            <span className="text-[11px] font-bold tracking-[0.06em] uppercase text-[var(--accent)]">{tag}</span>
          )}
          <h4 className="text-[15px] font-semibold leading-snug text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors mt-0.5">
            {title}
          </h4>
          <span className="text-[12px] text-[var(--text-tertiary)] mt-1 block">{date}</span>
        </div>
        {image && (
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <img src={imgSrc(image)} alt={title} className="w-full h-full object-cover" />
          </div>
        )}
      </motion.a>
    );
  }

  // Standard: 图在上 + 文字在下
  return (
    <motion.a
      href={href} {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      whileHover={{ y: -2 }}
      className="block bg-[var(--bg-primary)] rounded-2xl overflow-hidden group shadow-sm border border-[var(--border)] hover:shadow-md transition-shadow duration-300"
    >
      {/* 图片区 */}
      <div className="aspect-[16/10] overflow-hidden bg-[var(--bg-secondary)]">
        {image ? (
          <img src={imgSrc(image)} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl">
            {tag ? tag[0] : "📰"}
          </div>
        )}
      </div>

      {/* 文字区 */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-1.5">
          {tag && (
            <span className="text-[11px] font-bold tracking-[0.06em] uppercase text-[var(--accent)]">
              {tag}
            </span>
          )}
          <span className="text-[11px] text-[var(--text-tertiary)]">{date}</span>
        </div>
        <h4 className="text-[17px] font-bold leading-[1.25] text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors tracking-[-0.01em] line-clamp-2">
          {title}
        </h4>
        {summary && (
          <p className="text-[13px] text-[var(--text-secondary)] mt-1.5 leading-relaxed line-clamp-2">{summary}</p>
        )}
      </div>
    </motion.a>
  );
}
