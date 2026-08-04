"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface WeChatPopupProps {
  open: boolean;
  onClose: () => void;
  wechatUrl: string;
}

export function WeChatPopup({ open, onClose, wechatUrl }: WeChatPopupProps) {
  // 关掉时恢复滚动
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(wechatUrl)}`;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative rounded-2xl p-8 max-w-xs w-full mx-4 text-center shadow-xl"
            style={{ background: "var(--color-paper)" }}
          >
            {/* 关闭按钮 */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--color-paper-2)] transition-colors"
              style={{ color: "var(--color-ink-3)" }}
              aria-label="关闭"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* 微信图标 */}
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "var(--color-accent-light)" }}
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="var(--color-accent)">
                <path d="M8.5 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm7 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM12 2C6.48 2 2 6.48 2 12c0 1.93.55 3.72 1.5 5.26L2 22l4.93-1.52C8.2 21.42 10.04 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.73 0-3.36-.5-4.76-1.36l-.34-.2-3.05.94.93-3.04-.22-.36A7.96 7.96 0 0 1 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z"/>
              </svg>
            </div>

            {/* 标题 */}
            <h3 className="text-[17px] font-bold mb-1" style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)" }}>
              宜阳县红旗实验学校
            </h3>
            <p className="text-[12px] mb-6" style={{ color: "var(--color-ink-3)" }}>
              微信公众号
            </p>

            {/* 二维码 */}
            <div className="rounded-xl overflow-hidden mx-auto mb-5 w-[200px] h-[200px]"
              style={{ background: "white", border: "1px solid var(--color-rule)" }}
            >
              <img
                src={qrUrl}
                alt="公众号二维码"
                className="w-full h-full object-contain"
              />
            </div>

            {/* 提示 */}
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--color-ink-2)" }}>
              打开手机微信
              <br />
              扫一扫 · 关注学校公众号
            </p>

            {/* 操作按钮 */}
            <div className="mt-6 flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-[13px] font-medium transition-colors hover:opacity-80"
                style={{ background: "var(--color-paper-2)", color: "var(--color-ink-2)" }}
              >
                知道了
              </button>
              <a
                href={wechatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-xl text-[13px] font-medium text-white transition-colors hover:opacity-90"
                style={{ background: "var(--color-accent)" }}
              >
                在浏览器打开
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
