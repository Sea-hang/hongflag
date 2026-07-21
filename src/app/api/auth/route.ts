import { NextRequest, NextResponse } from "next/server";
import {
  getClientIP, checkRateLimit, createToken, verifyToken,
  blacklistToken, isTokenBlacklisted,
} from "@/lib/api-auth";

// ============================================================
// 🔐 认证 API — 密码验证 + Token 签发 + 退出登录
// ============================================================

// 密码 "918120" + 盐 "hongflag2026" 的 SHA-256 哈希
const PASSWORD_HASH = "e5dd067309c6fa30e3db042d46311ef4e6228f51b3985a15afbcdc678725fe5c";
const SALT = "hongflag2026";

async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

// POST /api/auth — 登录
export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "尝试次数过多，请1分钟后再试" },
      { status: 429 }
    );
  }

  try {
    const body = (await request.json()) as { password?: string };
    const { password } = body;

    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "请输入密码" }, { status: 400 });
    }

    const hashed = await sha256(password + SALT);

    if (!timingSafeEqual(hashed, PASSWORD_HASH)) {
      return NextResponse.json({ error: "密码错误" }, { status: 401 });
    }

    const token = await createToken("teacher");
    return NextResponse.json({ token, role: "teacher" });
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

// GET /api/auth — 验证 token
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token || isTokenBlacklisted(token)) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }

  const result = await verifyToken(token);
  if (result.valid) {
    return NextResponse.json({ valid: true, role: result.role });
  }
  return NextResponse.json({ valid: false }, { status: 401 });
}

// DELETE /api/auth — 退出登录
export async function DELETE(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (token) {
    blacklistToken(token);
  }

  return NextResponse.json({ success: true });
}
