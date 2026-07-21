import { NextResponse } from "next/server";
import { readdir, stat } from "fs/promises";
import path from "path";

// GET /api/files — 列出 public/uploads/activities/ 中的文件（仅本地可用）
export async function GET() {
  try {
    const dir = path.join(process.cwd(), "public", "uploads", "activities");
    const names = await readdir(dir);
    const files = await Promise.all(
      names
        .filter((n) => !n.startsWith("."))
        .map(async (name) => {
          const full = path.join(dir, name);
          const s = await stat(full);
          return {
            name,
            path: `/uploads/activities/${name}`,
            size: s.size,
            isImage: /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(name),
          };
        })
    );
    // 按修改时间降序排列
    files.sort((a, b) => b.name.localeCompare(a.name));
    return NextResponse.json(files);
  } catch {
    return NextResponse.json({ error: "仅本地可用" }, { status: 500 });
  }
}
