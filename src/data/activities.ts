// ============================================================
// 📢 活动栏 — 类型定义 & 页面文案
// 活动数据存储在 src/data/activities.json 中
// 通过 /admin 页面添加/删除活动，上传配图
// ============================================================

export interface ActivityItem {
  id: string;
  type: "notice" | "news";
  title: string;
  date: string;
  tag?: string;
  tagColor?: "red" | "orange" | "blue" | "green";
  summary: string;
  /** 活动配图路径，如 "/uploads/activities/xxx.jpg" */
  image?: string;
}
