import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const res = NextResponse.next();

  // TEMP: disable cache for testing
  res.headers.set("Cache-Control", "no-store");
  res.headers.set("x-proxy-active", "true");

  // Security headers
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  res.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://telegram.org",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https:",
      "frame-ancestors https://web.telegram.org https://*.telegram.org",
      "base-uri 'self'",
      "form-action 'self'"
    ].join("; ")
  );

  const ua = req.headers.get("user-agent") || "";
  res.headers.set("x-client-source", ua.includes("Telegram") ? "telegram" : "browser");

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};


