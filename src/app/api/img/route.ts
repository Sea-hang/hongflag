import { NextRequest, NextResponse } from "next/server";

// ============================================================
// 🖼️ 图片代理 — 绕过微信防盗链
//    /api/img?url=https://mmbiz.qpic.cn/...
//    图片不存 KV，实时从源站获取
// ============================================================

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) {
    return new NextResponse("Missing url", { status: 400 });
  }

  // 安全检查：只允许微信图片域名
  const allowed = ["mmbiz.qpic.cn", "mmbiz.qlogo.cn"];
  try {
    const host = new URL(url).hostname;
    if (!allowed.some((d) => host.endsWith(d))) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  } catch {
    return new NextResponse("Invalid url", { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ImageProxy/1.0)",
        Referer: "https://mp.weixin.qq.com/",
      },
    });

    if (!res.ok) {
      return new NextResponse("Image not found", { status: 404 });
    }

    const buf = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || "image/jpeg";

    // 缓存 7 天（浏览器 + Cloudflare 边缘）
    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=604800, s-maxage=604800, immutable",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return new NextResponse("Fetch failed", { status: 502 });
  }
}
