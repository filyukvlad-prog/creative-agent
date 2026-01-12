import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const IS_PROD = process.env.NODE_ENV === "production";
const ALLOWED_METHODS = new Set(["GET", "HEAD", "OPTIONS", "POST"]);
const FRAME_ANCESTORS = ["https://web.telegram.org", "https://*.telegram.org"].join(" ");

function safeEqualHex(a: string, b: string) {
  // constant-time-ish compare for hex strings
  if (a.length !== b.length) return false;
  let res = 0;
  for (let i = 0; i < a.length; i++) {
    res |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return res === 0;
}

function base64ToString(b64: string) {
  // works in edge runtime
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

async function hmacSha256Hex(key: string, message: string) {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(message));
  const bytes = new Uint8Array(sig);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function isSessionFresh(iatMs: number, maxAgeDays = 7) {
  if (!Number.isFinite(iatMs)) return false;
  const now = Date.now();
  const maxAgeMs = maxAgeDays * 24 * 60 * 60 * 1000;
  return now - iatMs >= 0 && now - iatMs <= maxAgeMs;
}

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const method = req.method.toUpperCase();

  // ---- 1) Method hardening ----
  if (!ALLOWED_METHODS.has(method)) {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }
  if (method === "OPTIONS") {
    return NextResponse.next();
  }

  // ---- 2) Protected routes (signed session gate) ----
  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/generate") ||
    pathname.startsWith("/result");

  if (isProtected) {
    const sessionB64 = req.cookies.get("ca_session")?.value;
    const sigHex = req.cookies.get("ca_sig")?.value;

    if (!sessionB64 || !sigHex) {
      const url = req.nextUrl.clone();
      url.pathname = "/onboarding";
      return NextResponse.redirect(url);
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      // misconfig: better fail closed
      return new NextResponse("Server misconfigured", { status: 500 });
    }

    let payload: any;
    let payloadStr = "";
    try {
      payloadStr = base64ToString(sessionB64);
      payload = JSON.parse(payloadStr);
    } catch {
      const url = req.nextUrl.clone();
      url.pathname = "/onboarding";
      return NextResponse.redirect(url);
    }

    // payload sanity checks
    const uid = Number(payload?.uid);
    const iat = Number(payload?.iat);
    if (!uid || !isSessionFresh(iat, 7)) {
      const url = req.nextUrl.clone();
      url.pathname = "/onboarding";
      return NextResponse.redirect(url);
    }

    // verify signature = HMAC_SHA256(botToken, payloadStr) hex
    const computed = await hmacSha256Hex(botToken, payloadStr);
    if (!safeEqualHex(computed, sigHex)) {
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
  res.headers.set("x-proxy-version", "v2.2");

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};




