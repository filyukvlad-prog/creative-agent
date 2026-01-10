import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const IS_PROD = process.env.NODE_ENV === "production";

// Дозволені методи для сторінок (все інше — 405)
const ALLOWED_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

// Мінімально необхідні origins для Telegram WebApp
const FRAME_ANCESTORS = [
  "https://web.telegram.org",
  "https://*.telegram.org",
].join(" ");

export function proxy(req: NextRequest) {
  const res = NextResponse.next();

  const pathname = req.nextUrl.pathname;
  const method = req.method.toUpperCase();

  // ---- 1) Method hardening ----
  if (!ALLOWED_METHODS.has(method)) {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }

  // ---- 2) Cache hardening (route-based) ----
  // Публічне кешування — тільки для "нейтральних" шляхів.
  // Для будь-якого user-flow / paywall / generate — no-store.
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
    // Статичні/публічні
    res.headers.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
  }

  // ---- 3) Core security headers ----
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  // HSTS тільки в prod
  if (IS_PROD) {
    res.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  // ---- 4) Telegram-friendly CSP ----
  // Не ставимо X-Frame-Options (може зламати Telegram webview).
  // Контроль робимо через frame-ancestors.
  // Увага: 'unsafe-inline' потрібен через telegram-web-app.js у head + інлайн стилі.
  const csp = [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    `frame-ancestors ${FRAME_ANCESTORS}`,
    "object-src 'none'",
    // scripts
    "script-src 'self' 'unsafe-inline' https://telegram.org",
    // styles
    "style-src 'self' 'unsafe-inline'",
    // images/fonts
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    // network
    "connect-src 'self' https:",
    // upgrades
    "upgrade-insecure-requests",
  ].join("; ");

  res.headers.set("Content-Security-Policy", csp);

  // ---- 5) Anti-clickjacking marker (non-enforcing, for monitoring) ----
  // Корисно для дебагу та аналізу трафіку.
  const ua = req.headers.get("user-agent") || "";
  res.headers.set("x-client-source", ua.includes("Telegram") ? "telegram" : "browser");

  // ---- 6) Optional: Basic COOP (safe mode) ----
  // SAME-ORIGIN допомагає від деяких атак з window.opener.
  // Якщо колись зламає інтеграції — можна вимкнути.
  res.headers.set("Cross-Origin-Opener-Policy", "same-origin");

  // ---- 7) Debug marker ----
  res.headers.set("x-proxy-active", "true");
  res.headers.set("x-proxy-version", "v2");

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};



