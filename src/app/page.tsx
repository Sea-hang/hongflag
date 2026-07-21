// ============================================================
// 🏫 红旗实验学校网站 — 首页
// ============================================================
// 页面结构：导航 → Hero → 学校简介 → 活动预览 → 页脚
// 所有组件均为客户端渲染（"use client"），支持动态数据
// ============================================================

import { Hero } from "@/components/sections/Hero";
import { AboutPreview } from "@/components/sections/AboutPreview";
import { ActivitiesPreview } from "@/components/sections/ActivitiesPreview";
import { GlassNav } from "@/components/ui/GlassNav";
import { Footer } from "@/components/ui/Footer";

export default function Home() {
  return (
    <>
      <GlassNav />
      <Hero />
      <AboutPreview />
      <ActivitiesPreview />
      <Footer />
    </>
  );
}
