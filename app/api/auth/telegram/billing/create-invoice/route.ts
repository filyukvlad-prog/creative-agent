import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) return NextResponse.json({ ok: false, error: "Missing bot token" }, { status: 500 });

  // Stars invoice uses currency XTR (Telegram Stars) :contentReference[oaicite:3]{index=3}
  const body = {
    title: "Creative Agent PRO",
    description: "PRO доступ на 30 днів",
    payload: "pro_30d",               // твоє внутрішнє значення
    currency: "XTR",
    prices: [{ label: "PRO (30 days)", amount: 999 }], // 999 Stars-одиниць (підбери ціну під себе)
  };

  // createInvoiceLink — генерує посилання на інвойс :contentReference[oaicite:4]{index=4}
  // Для Stars provider_token не передаємо. :contentReference[oaicite:5]{index=5}
  const resp = await fetch(`https://api.telegram.org/bot${botToken}/createInvoiceLink`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await resp.json();
  if (!data.ok) {
    return NextResponse.json({ ok: false, error: data.description || "Telegram API error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, invoiceLink: data.result });
}
