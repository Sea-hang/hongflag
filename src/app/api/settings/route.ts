import { NextRequest, NextResponse } from "next/server";
import { settingsStore } from "@/lib/settings-store";
import { requireTeacher } from "@/lib/api-auth";

// GET /api/settings — 获取站点设置
export async function GET() {
  try {
    const data = await settingsStore.get();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "读取设置失败" }, { status: 500 });
  }
}

// POST /api/settings — 保存站点设置（需教师权限）
export async function POST(request: NextRequest) {
  // 🔐 权限校验
  const authError = await requireTeacher(request);
  if (authError) return authError;

  try {
    const body = (await request.json()) as Record<string, string>;
    const { heroBgImage, aboutPreviewImage, aboutImage, contactMapImage } = body;

    await settingsStore.save({
      heroBgImage: heroBgImage || undefined,
      aboutPreviewImage: aboutPreviewImage || undefined,
      aboutImage: aboutImage || undefined,
      contactMapImage: contactMapImage || undefined,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "保存设置失败" }, { status: 500 });
  }
}
