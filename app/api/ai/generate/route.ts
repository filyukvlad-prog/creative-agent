import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

function buildPrompt(input: any) {
  const platform = String(input?.platform || "telegram");
  const topic = String(input?.topic || "").trim();
  const goal = String(input?.goal || "").trim();
  const tone = String(input?.tone || "friendly").trim();
  const audience = String(input?.audience || "").trim();
  const length = String(input?.length || "medium").trim();
  const lang = String(input?.lang || "uk").trim();

  return `
Language: ${lang}
Platform: ${platform}
Tone: ${tone}
Length: ${length}
Topic: ${topic || "(not provided)"}
Goal: ${goal || "(not provided)"}
Audience: ${audience || "(not provided)"}

Generate:
1) Hook (1 line)
2) Body (structured, readable)
3) CTA (1–2 lines)
4) 5 hashtags (if platform supports)
  `.trim();
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ ok: false, error: "Missing OPENAI_API_KEY" }, { status: 500 });
    }

    const body = await req.json().catch(() => ({}));
    if (!body?.topic) {
      return NextResponse.json({ ok: false, error: "Missing topic" }, { status: 400 });
    }

    const client = new OpenAI({ apiKey });

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      instructions:
        "You are a senior social media copywriter. Output clean text only. Keep it concise and high quality.",
      input: buildPrompt(body),
    });

    return NextResponse.json({ ok: true, text: response.output_text });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Unknown error" }, { status: 500 });
  }
}


