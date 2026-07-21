// ============================================================
// 🔐 API 认证工具 — 密码哈希、Token 签发/验证、限流、路由守卫
// ============================================================
// Token 格式：自定义 JWT（Header.Payload.Signature）
// 签名算法：HMAC-SHA256
// 有效期：24 小时
// 限流：每 IP 每分钟最多 5 次登录尝试
// ============================================================

import { NextRequest, NextResponse } from "next/server";

// Token 签名密钥（生产环境建议放环境变量）
const TOKEN_SECRET = "hqsyxx-school-2026-secret-key";

// 限流数据结构：IP → 尝试次数和重置时间
const rateLimit = new Map<string, { count: number; resetTime: number }>();
const MAX_ATTEMPTS = 5;    // 每分钟最多尝试次数
const WINDOW_MS = 60_000;  // 限流窗口：60 秒

// Token 黑名单（退出登录后加入，防止重复使用）
const tokenBlacklist = new Set<string>();

// --- HMAC-SHA256 签名 ---
async function hmacSha256(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// --- Base64 URL 安全编码 ---
function base64Url(str: string): string {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str: string): string {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  return atob(str);
}

// --- 时序安全比较（防止时序攻击）---
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

// --- 限流 ---

// 获取客户端真实 IP（优先 Cloudflare 头部）
export function getClientIP(request: NextRequest): string {
  return request.headers.get("cf-connecting-ip") ||
         request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
         "127.0.0.1";
}

// 检查是否超过限流阈值
export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_ATTEMPTS) return false;
  entry.count++;
  return true;
}

// --- Token 签发 ---

// 创建 Token：payload 含角色、签发时间、过期时间、唯一 ID
export async function createToken(role: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    role,
    iat: now,
    exp: now + 86400,     // 24 小时后过期
    jti: crypto.randomUUID(),  // 唯一 ID，用于黑名单
  };

  const headerB64 = base64Url(JSON.stringify(header));
  const payloadB64 = base64Url(JSON.stringify(payload));
  const dataToSign = `${headerB64}.${payloadB64}`;
  const signature = await hmacSha256(dataToSign, TOKEN_SECRET);

  return `${dataToSign}.${signature}`;
}

// 验证 Token：检查签名、过期时间、黑名单
export async function verifyToken(token: string): Promise<{ valid: boolean; role?: string }> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return { valid: false };

    // 检查是否在黑名单中（已退出登录）
    if (tokenBlacklist.has(token)) return { valid: false };

    const dataToVerify = `${parts[0]}.${parts[1]}`;
    const expectedSig = await hmacSha256(dataToVerify, TOKEN_SECRET);

    // 时序安全比较签名
    if (!timingSafeEqual(parts[2], expectedSig)) return { valid: false };

    const payload = JSON.parse(fromBase64Url(parts[1]));
    // 检查是否过期
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return { valid: false };
    }

    return { valid: true, role: payload.role };
  } catch {
    return { valid: false };
  }
}

// 将 Token 加入黑名单
export function blacklistToken(token: string): void {
  tokenBlacklist.add(token);
  // 防止内存泄漏：超过 1000 条时清理最早的 100 条
  if (tokenBlacklist.size > 1000) {
    const iter = tokenBlacklist.values();
    for (let i = 0; i < 100; i++) iter.next();
  }
}

export function isTokenBlacklisted(token: string): boolean {
  return tokenBlacklist.has(token);
}

// --- API 路由守卫 ---

// 验证教师权限，未登录或非教师返回 401
export async function requireTeacher(request: NextRequest): Promise<NextResponse | null> {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return NextResponse.json({ error: "未登录，请先登录" }, { status: 401 });
  }

  const result = await verifyToken(token);
  if (!result.valid || result.role !== "teacher") {
    return NextResponse.json({ error: "登录已过期，请重新登录" }, { status: 401 });
  }

  return null;  // 验证通过
}
