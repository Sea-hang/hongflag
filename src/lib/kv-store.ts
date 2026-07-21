// ============================================================
// 📦 存储适配层 — 统一本地开发和 Cloudflare KV 的数据读写
// ============================================================
// 本地开发：读写 src/data/activities.json 文件
// Cloudflare：读写 KV 命名空间 ACTIVITIES_STORE
// 所有操作通过统一的 store 对象调用，上层无需关心环境
// ============================================================

import { readFile, writeFile } from "fs/promises";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "src", "data", "activities.json");

// 活动数据结构：一条新闻或通知
interface Activity {
  id: string;            // 唯一标识
  type: "notice" | "news";  // 类型：通知 或 新闻
  title: string;         // 标题
  date: string;          // 日期（格式 MM-DD）
  tag?: string;          // 标签文字（可选）
  tagColor?: string;     // 标签颜色（可选）
  summary: string;       // 摘要
  image?: string;        // 图片 URL（可选，不存 base64，只存链接）
  link?: string;         // 微信原文链接（可选，点击跳转）
}

export type { Activity };

// --- 本地文件操作 ---
async function fileRead(): Promise<Activity[]> {
  const raw = await readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

async function fileWrite(data: Activity[]): Promise<void> {
  await writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

// --- 获取 Cloudflare KV 绑定（仅线上环境有效）---
async function getKV() {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = await getCloudflareContext();
    return env?.ACTIVITIES_STORE as KVNamespace | undefined;
  } catch {
    return undefined;
  }
}

// --- 统一接口 ---
export const store = {
  // 获取所有活动
  async getAll(): Promise<Activity[]> {
    const kv = await getKV();
    if (kv) {
      const raw = await kv.get("activities");
      return raw ? JSON.parse(raw) : [];
    }
    return fileRead();
  },

  // 覆盖保存所有活动
  async saveAll(data: Activity[]): Promise<void> {
    const kv = await getKV();
    if (kv) {
      await kv.put("activities", JSON.stringify(data));
    } else {
      await fileWrite(data);
    }
  },

  // 添加一条活动（插入到最前面）
  async add(activity: Activity): Promise<void> {
    const all = await this.getAll();
    all.unshift(activity);
    await this.saveAll(all);
  },

  // 删除指定 ID 的活动
  async delete(id: string): Promise<boolean> {
    const all = await this.getAll();
    const idx = all.findIndex((a) => a.id === id);
    if (idx === -1) return false;
    all.splice(idx, 1);
    await this.saveAll(all);
    return true;
  },
};
