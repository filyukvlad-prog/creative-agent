import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";

function timingSafeEqualHex(a: string, b: string) {
  const aBuf = Buffer.from(a, "hex");
  const bBuf = Buffer.from(b, "hex");
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

function parseInitData(initData: string) {
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) throw new Error("Missing hash");

  params.delete("hash");

  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("\n");

  const authDate = Number(params.get("auth_date") || "0");
  const userJson = params.get("user");

  return { hash, dataCheckString, authDate, userJson };
}

function verifyTelegramInitData(initData: string, botToken: string) {
  const { hash, dataCheckString, authDate, userJson } = parseInitData(initData);

  // freshness window: 24h
  const now = Math.floor(Date.now() / 1000);
  if (!authDate || now - authDate > 24 * 60 * 60) {
    throw new Error("initData expired");
  }

  // secret_key = HMAC_SHA256("WebAppData", botToken)
  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(botToken)
    .digest();

  // computed_hash = HMAC_SHA256(data_check_string, secret_key)
  const computedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  if (!timingSafeEqualHex(computedHash, hash)) {
    throw new Error("Bad initData signature");
  }

  const user = userJson ? JSON.parse(userJson) : null;
  if (!user?.id) throw new Error("Missing user");

  return { user };
}

export async function POST(req: Request) {
  try {
    const { initData } = await req.json();
    if (!initData) return NextResponse.json({ ok: false }, { status: 400 });

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) return NextResponse.json({ ok: false }, { status: 500 });

    const { user } = verifyTelegramInitData(initData, botToken);

    // Session payload (stringified JSON)
    const payloadStr = JSON.stringify({ uid: user.id, iat: Date.now() });

    // Signature = HMAC_SHA256(botToken, payloadStr) hex
    const sigHex = crypto.createHmac("sha256", botToken).update(payloadStr).digest("hex");

    const res = NextResponse.json({
      ok: true,
      user: { id: user.id, first_name: user.first_name ?? "" },
    });

    // Cookies: base64(payloadStr) + sigHex (HttpOnly)
    res.cookies.set("ca_session", Buffer.from(payloadStr).toString("base64"), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    res.cookies.set("ca_sig", sigHex, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return res;
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 401 });
  }
}