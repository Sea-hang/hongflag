import { NextRequest, NextResponse } from "next/server";
import { store, type Activity } from "@/lib/kv-store";
import { requireTeacher } from "@/lib/api-auth";

// GET /api/activities — 获取所有活动
export async function GET() {
  try {
    const data = await store.getAll();
    return NextResponse.json(data || []);
  } catch (e) {
    return NextResponse.json([]);
  }
}

// POST /api/activities — 新增活动（需教师权限）
export async function POST(request: NextRequest) {
  // 🔐 权限校验
  const authError = await requireTeacher(request);
  if (authError) return authError;

  try {
    const body = await request.json() as Record<string, string>;
    const { type, title, date, tag, tagColor, summary, image, link } = body;

    if (!type || !title || !date || !summary) {
      return NextResponse.json({ error: "请填写完整信息" }, { status: 400 });
    }
    if (type !== "notice" && type !== "news") {
      return NextResponse.json({ error: "类型无效" }, { status: 400 });
    }

    const id = `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const activity: Activity = { id, type, title, date, summary };
    if (tag) activity.tag = tag;
    if (tagColor) activity.tagColor = tagColor;
    if (image) activity.image = image;
    if (link) activity.link = link;

    await store.add(activity);
    return NextResponse.json({ success: true, activity });
  } catch {
    return NextResponse.json({ error: "添加失败" }, { status: 500 });
  }
}
