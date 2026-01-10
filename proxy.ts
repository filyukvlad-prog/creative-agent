import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const IS_PROD = process.env.NODE_ENV === "production";
const ALLOWED_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
const FRAME_ANCESTORS = ["https://web.telegram.org", "https://*.telegram.org"].join(" ");

export function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const method = req.method.toUpperCase();

  // ---- 1) Method hardening ----
  if (!ALLOWED_METHODS.has(method)) {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }

  // OPTIONS (preflight) — не чіпаємо
  if (method === "OPTIONS") {
    return NextResponse.next();
  }

  // ---- 2) Protected routes (session gate) ----
  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/generate") ||
    pathname.startsWith("/result");

  if (isProtected) {
    const session = req.cookies.get("ca_session")?.value;
    const sig = req.cookies.get("ca_sig")?.value;

    // Мінімальна перевірка (поки що): cookie мають існувати
    if (!session || !sig) {
      const url = req.nextUrl.clone();
      url.pathname = "/onboarding";
      return NextResponse.redirect(url);
    }
  }

  const res = NextResponse.next();

  // ---- 3) Cache hardening (route-based) ----
  if (
    pathname === "/" ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/generate") ||
    pathname.startsWith("/result") ||
    pathname.startsWith("/paywall") ||
    pathname.startsWith("/settings")
  ) {
    res.headers.set("Cache-Control", "private, no-store");
  } else {
    res.headers.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
  }

  // ---- 4) Core security headers ----
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  if (IS_PROD) {
    res.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  // ---- 5) CSP (Telegram-friendly) ----
  const csp = [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    `frame-ancestors ${FRAME_ANCESTORS}`,
    "object-src 'none'",
    "script-src 'self' 'unsafe-inline' https://telegram.org",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https:",
    "upgrade-insecure-requests",
  ].join("; ");

  res.headers.set("Content-Security-Policy", csp);

  // ---- 6) Monitoring headers ----
  const ua = req.headers.get("user-agent") || "";
  res.headers.set("x-client-source", ua.includes("Telegram") ? "telegram" : "browser");
  res.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  res.headers.set("x-proxy-active", "true");
  res.headers.set("x-proxy-version", "v2");

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};



