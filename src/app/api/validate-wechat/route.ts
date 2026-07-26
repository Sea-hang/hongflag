// ============================================================
// 🔒 GET /api/validate-wechat?url=...
//    校验微信文章是否来自本校服务号
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { validateWechatArticle } from "@/lib/wechat-validate";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ valid: false, biz: "", message: "缺少 url 参数" }, { status: 400 });
  }
  const result = await validateWechatArticle(url);
  return NextResponse.json(result);
}
