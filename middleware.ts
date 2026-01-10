import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // ===== Security Headers =====
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  // ===== CSP (базовий, без лому) =====
  res.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "connect-src 'self' https://api.telegram.org",
      "frame-ancestors 'none'",
    ].join("; ")
  );

  // ===== Telegram WebApp detection (soft) =====
  const userAgent = req.headers.get("user-agent") || "";
  if (!userAgent.includes("Telegram")) {
    // не блокуємо, але можна логувати або редіректити в майбутньому
    res.headers.set("X-Client-Source", "browser");
  } else {
    res.headers.set("X-Client-Source", "telegram");
  }

  return res;
}

// ===== Apply to all routes except static =====
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

