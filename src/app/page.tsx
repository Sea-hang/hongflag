// ============================================================
// 🏫 红旗实验学校 — 首页 (Braindrop 灵感)
// ============================================================

import { Hero } from "@/components/sections/Hero";
import { AboutPreview } from "@/components/sections/AboutPreview";
import { ActivitiesPreview } from "@/components/sections/ActivitiesPreview";
import { StackedBooks } from "@/components/sections/StackedBooks";
import { GlassNav } from "@/components/ui/GlassNav";
import { Footer } from "@/components/ui/Footer";

export default function Home() {
  return (
    <>
      <GlassNav />
      <Hero />
      <AboutPreview />
      <ActivitiesPreview />
      <StackedBooks />
      <Footer />
    </>
  );
}
