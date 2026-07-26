// ============================================================
// 🔒 微信公众号白名单校验
//    只允许本校服务号的文章被抓取
//    __biz 从文章页面 URL 或 HTML 中提取
// ============================================================

// 本校允许的服务号 __biz 列表
const ALLOWED_WECHAT_BIZ = ["MzU2MjEwNjk0Mw=="];

interface ValidateResult {
  valid: boolean;
  biz: string;
  message: string;
}

// 从 URL 查询参数中提取 __biz
function extractBizFromURL(url: string): string | null {
  try {
    const u = new URL(url);
    return u.searchParams.get("__biz");
  } catch {
    return null;
  }
}

// 从 HTML 中提取 __biz
function extractBizFromHTML(html: string): string | null {
  const patterns = [
    /var\s+__biz\s*=\s*"([^"]+)"/i,
    /__biz[=:]\s*"([^"]+)"/i,
    /biz[=:]\s*"([^"]+)"/i,
    /data-biz="([^"]+)"/i,
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m?.[1]) return m[1];
  }
  return null;
}

// 校验微信文章是否来自本校服务号
export async function validateWechatArticle(url: string): Promise<ValidateResult> {
  // 1. 基础校验：必须是微信文章链接
  if (!/mp\.weixin\.qq\.com/.test(url)) {
    return { valid: false, biz: "", message: "请输入微信公众号文章链接" };
  }

  try {
    // 2. 跟随重定向获取真实 URL
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 MicroMessenger/8.0.0",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });

    const finalURL = res.url;
    const html = await res.text();

    // 3. 从 URL 或 HTML 中提取 __biz
    let biz = extractBizFromURL(finalURL) || extractBizFromHTML(html);

    // 4. 对比白名单
    if (biz && ALLOWED_WECHAT_BIZ.includes(biz)) {
      return { valid: true, biz, message: "校验通过，为本校服务号文章" };
    }

    if (!biz) {
      return { valid: false, biz: "", message: "无法识别公众号，仅支持抓取本校服务号的文章" };
    }

    return { valid: false, biz, message: "仅支持抓取本校服务号的文章" };
  } catch {
    return { valid: false, biz: "", message: "校验失败，请检查链接是否正确" };
  }
}
