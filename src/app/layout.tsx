// ============================================================
// 🏫 红旗实验学校网站 — 根布局
// ============================================================
// 全局配置：字体（Inter）、主题（深色/浅色）、认证状态、平滑滚动、星空背景
// 所有子页面自动继承这些配置
// ============================================================

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { AuthProvider } from "@/lib/auth";
import { StarsBackground } from "@/components/ui/StarsBackground";
import { site } from "@/data/site";

// 加载 Inter 字体（Google Fonts），支持拉丁字符和中文回退
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

// 页面元数据（浏览器标签页标题、SEO 描述）
export const metadata: Metadata = {
  title: site.name,
  description: site.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        {/* 星空点阵背景（日间微灰点，夜间白星光） */}
        <StarsBackground />

        {/* 主题提供者：管理深色/浅色模式切换 */}
        <ThemeProvider>
          {/* 认证提供者：管理教师/学生/家长登录状态 */}
          <AuthProvider>
            {/* 平滑滚动：基于 Lenis 库，惯性滚动效果 */}
            <SmoothScroll>{children}</SmoothScroll>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
