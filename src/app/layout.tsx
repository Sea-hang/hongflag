// ============================================================
// 🏫 红旗实验学校网站 — 根布局
// ============================================================
// 字体: Noto Serif SC (标题艺术感) + Inter (正文) + Noto Sans SC (中文正文)
// 设计系统: design.md (project root)
// ============================================================

import type { Metadata } from "next";
import { Inter, Noto_Serif_SC } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { AuthProvider } from "@/lib/auth";
import { StarsBackground } from "@/components/ui/StarsBackground";
import { site } from "@/data/site";

// Inter — 西文正文
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Noto Serif SC — 中文展示/标题字体（艺术宋体，学术感）
const notoSerif = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  display: "swap",
  variable: "--font-noto-serif",
});

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
      <body
        className={`${inter.className} ${notoSerif.variable} antialiased`}
      >
        <StarsBackground />
        <ThemeProvider>
          <AuthProvider>
            <SmoothScroll>{children}</SmoothScroll>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
