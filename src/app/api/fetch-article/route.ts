import { NextRequest, NextResponse } from "next/server";

// ============================================================
// 📱 抓取微信公众号文章 — 粘贴链接 → 提取标题/日期/正文/图片URL
//    图片只存 URL，不下载，不占 KV 存储
// ============================================================

interface ExtractedArticle {
  title: string;
  date: string;
  summary: string;
  images: string[];
  link: string;
}

function parseWechatHTML(html: string, url: string): ExtractedArticle {
  let title = "";
  let date = "";
  let summary = "";
  const images: string[] = [];
  const link = url;

  // 1. 标题
  const titlePatterns = [
    /<meta\s+property="og:title"\s+content="([^"]*)"/i,
    /<meta\s+name="twitter:title"\s+content="([^"]*)"/i,
    /<h1[^>]*class="[^"]*rich_media_title[^"]*"[^>]*>([\s\S]*?)<\/h1>/i,
    /<title>([^<]*)<\/title>/i,
  ];
  for (const p of titlePatterns) {
    const m = html.match(p);
    if (m?.[1]?.trim()) {
      title = m[1].trim()
        .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"').replace(/&#39;/g, "'");
      title = title.replace(/\s*[｜|]\s*[^｜|]*$/, "").replace(/\s+-\s+[^-]*$/, "");
      break;
    }
  }

  // 2. 日期
  const datePatterns = [
    /var\s+create_time\s*=\s*"(\d+)"?/i,
    /var\s+publish_time\s*=\s*"(\d+)"?/i,
    /<em[^>]*id="publish_time"[^>]*>([^<]*)<\/em>/i,
  ];
  for (const p of datePatterns) {
    const m = html.match(p);
    if (m?.[1]) {
      const raw = m[1].trim();
      if (/^\d{10}$/.test(raw)) {
        const d = new Date(parseInt(raw) * 1000);
        date = `${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      } else if (/(\d{2})-(\d{2})/.test(raw)) {
        const dm = raw.match(/(\d{2})-(\d{2})/);
        if (dm) date = `${dm[1]}-${dm[2]}`;
      }
      if (date) break;
    }
  }
  if (!date) {
    const now = new Date();
    date = `${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  }

  // 3. 正文摘要
  const contentPatterns = [
    /<div[^>]*id="js_content"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*class="[^"]*rich_media_content[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
  ];
  let content = "";
  for (const p of contentPatterns) {
    const m = html.match(p);
    if (m?.[1]) { content = m[1]; break; }
  }
  if (content) {
    summary = content
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
      .replace(/&ldquo;/g, '"').replace(/&rdquo;/g, '"')
      .replace(/\s+/g, " ").trim()
      .slice(0, 200);
    if (content.length > 200) summary += "…";
  }

  // 4. 图片 — 只提取 URL，不下载
  // 微信图片可能在 data-src、src、或 mmbiz.qpic.cn 链接中
  const seen = new Set<string>();
  const imgRegexes = [
    /<img[^>]+data-src="(https:\/\/mmbiz\.qpic\.cn\/[^"]+)"/gi,
    /<img[^>]+src="(https:\/\/mmbiz\.qpic\.cn\/[^"]+)"/gi,
    /https:\/\/mmbiz\.qpic\.cn\/[^\s"'<>&]+/gi,
  ];
  for (const regex of imgRegexes) {
    let m;
    while ((m = regex.exec(html)) !== null) {
      const src = m[1] || m[0];
      const clean = src.replace(/^http:\/\//i, "https://").replace(/&amp;/g, "&");
      if (
        !clean.includes("avatar") &&
        !clean.includes("qrcode") &&
        !clean.includes("icon") &&
        !clean.includes("emoji") &&
        !clean.includes("/300") &&
        !seen.has(clean)
      ) {
        seen.add(clean);
        images.push(clean);
        if (images.length >= 8) break;
      }
    }
    if (images.length >= 8) break;
  }

  return { title, date, summary, images, link };
}

// POST /api/fetch-article
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { url: string };
    const { url } = body;

    if (!url || !/mp\.weixin\.qq\.com/.test(url)) {
      return NextResponse.json({ error: "请输入有效的微信公众号文章链接" }, { status: 400 });
    }

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 MicroMessenger/8.0.0",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });

    if (!res.ok) {
      return NextResponse.json({ error: `文章访问失败 (${res.status})` }, { status: 502 });
    }

    const html = await res.text();
    if (html.length < 500) {
      return NextResponse.json({ error: "无法读取文章内容" }, { status: 400 });
    }

    const article = parseWechatHTML(html, url);
    if (!article.title) {
      return NextResponse.json({ error: "未能提取文章标题，请手动填写" }, { status: 422 });
    }

  // 图片 URL 通过代理加载，绕过微信防盗链
  article.images = article.images.map(
    (img) => `/api/img?url=${encodeURIComponent(img)}`,
  );

    return NextResponse.json({ success: true, article });
  } catch {
    return NextResponse.json({ error: "抓取失败，请检查网络或链接" }, { status: 500 });
  }
}
