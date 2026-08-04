"use client";

import { motion } from "framer-motion";
import Tooltip from "./Tooltip";

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
        className="relative block w-full max-md:rounded-xl rounded-2xl overflow-hidden group cursor-pointer active:scale-[0.98] transition-transform duration-200"
        style={{ minHeight: "380px" }}
      >
        {image ? (
          <img src={imgSrc(image)} alt={title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br"
            style={{ background: "linear-gradient(135deg, var(--color-accent), var(--color-accent-2))" }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        {link && (
          <div className="absolute bottom-4 right-4 z-10">
            <Tooltip
              tooltipText={`查看${title}详情`}
              buttonText="点击跳转"
              href={link}
            />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          {tag && (
            <span className="inline-block text-[11px] font-bold tracking-[0.08em] uppercase text-white/80 mb-2">
              {tag}
            </span>
          )}
          <h3 className="text-[22px] md:text-[32px] font-bold leading-[1.15] text-white mb-2 tracking-[-0.01em]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </h3>
          {summary && (
            <p className="text-[15px] text-white/70 leading-relaxed line-clamp-2 max-w-lg">{summary}</p>
          )}
          <span className="inline-block text-[11px] text-white/50 mt-3 font-medium">{date}</span>
        </div>
      </motion.a>
    );
  }

  // Compact: 纯文字、小卡片
  if (variant === "compact") {
    return (
      <motion.a
        href={href} {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        whileHover={{ x: 3 }}
        className="flex items-start gap-3 py-3.5 group border-b last:border-0"
        style={{ borderColor: "var(--color-rule)" }}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            {tag && (
              <span className="text-[11px] font-bold tracking-[0.06em] uppercase"
                style={{ color: "var(--color-accent)" }}
              >
                {tag}
              </span>
            )}
            <span className="text-[11px]" style={{ color: "var(--color-ink-3)" }}>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <h4 className="text-[15px] font-semibold leading-snug transition-colors duration-200"
              style={{ color: "var(--color-ink)" }}
            >
              {title}
            </h4>
            {link && (
              <Tooltip
                tooltipText={`查看${title}详情`}
                buttonText="跳转"
                href={link}
              />
            )}
          </div>
        </div>
        {image && (
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 relative border"
            style={{ borderColor: "var(--color-rule)" }}
          >
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
      whileHover={{ y: -3 }}
      className="block max-md:rounded-xl rounded-2xl overflow-hidden group transition-all duration-300 border active:scale-[0.98]"
      style={{
        background: "var(--color-card)",
        borderColor: "var(--color-rule)",
        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.04)",
      }}
    >
      {/* 图片区 */}
      <div className="max-md:aspect-[4/3] aspect-[16/10] overflow-hidden relative"
        style={{ background: "var(--color-paper-2)" }}
      >
        {image ? (
          <img src={imgSrc(image)} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl"
            style={{ background: "linear-gradient(135deg, var(--color-accent-light), transparent)" }}
          >
            {tag ? tag[0] : "📰"}
          </div>
        )}
        {link && (
          <div className="absolute bottom-2 right-2 z-10">
            <Tooltip
              tooltipText={`查看${title}详情`}
              buttonText="点击跳转"
              href={link}
            />
          </div>
        )}
      </div>

      {/* 文字区 */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-1.5">
          {tag && (
            <span className="text-[11px] font-bold tracking-[0.06em] uppercase"
              style={{ color: "var(--color-accent)" }}
            >
              {tag}
            </span>
          )}
          <span className="text-[11px]" style={{ color: "var(--color-ink-3)" }}>{date}</span>
        </div>
        <h4 className="text-[17px] font-bold leading-[1.25] transition-colors duration-200 tracking-[-0.01em] line-clamp-2"
          style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)" }}
        >
          {title}
        </h4>
        {summary && (
          <p className="text-[13px] mt-1.5 leading-relaxed line-clamp-2"
            style={{ color: "var(--color-ink-2)" }}
          >
            {summary}
          </p>
        )}
      </div>
    </motion.a>
  );
}
