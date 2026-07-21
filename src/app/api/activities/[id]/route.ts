import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/kv-store";
import { requireTeacher } from "@/lib/api-auth";

// DELETE /api/activities/:id — 删除活动（需教师权限）
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 🔐 权限校验
  const authError = await requireTeacher(request);
  if (authError) return authError;

  const { id } = await params;
  const ok = await store.delete(id);
  if (!ok) return NextResponse.json({ error: "活动不存在" }, { status: 404 });
  return NextResponse.json({ success: true });
}
