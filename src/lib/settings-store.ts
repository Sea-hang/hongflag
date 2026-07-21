// ============================================================
// ⚙️ 站点设置存储层
// 本地 dev → 读写 JSON 文件
// Cloudflare → 读写 KV (通过 getCloudflareContext)
// ============================================================

import { readFile, writeFile } from "fs/promises";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "src", "data", "settings.json");

export interface SiteSettings {
  heroBgImage?: string;
  aboutPreviewImage?: string;
  aboutImage?: string;
  contactMapImage?: string;
}

// --- 本地文件操作 ---
async function fileRead(): Promise<SiteSettings> {
  try {
    const raw = await readFile(DATA_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function fileWrite(data: SiteSettings): Promise<void> {
  await writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

// --- 获取 KV 绑定（仅在 Cloudflare 环境有效）---
async function getKV() {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = await getCloudflareContext();
    return env?.SETTINGS_STORE as KVNamespace | undefined;
  } catch {
    return undefined;
  }
}

// --- 统一接口 ---
export const settingsStore = {
  async get(): Promise<SiteSettings> {
    const kv = await getKV();
    if (kv) {
      const raw = await kv.get("site-settings");
      return raw ? JSON.parse(raw) : fileRead();
    }
    return fileRead();
  },

  async save(data: SiteSettings): Promise<void> {
    const kv = await getKV();
    if (kv) {
      await kv.put("site-settings", JSON.stringify(data));
    } else {
      await fileWrite(data);
    }
  },
};
