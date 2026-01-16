"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Platform = "Instagram" | "Telegram" | "LinkedIn";
type Tone = "Expert" | "Friendly" | "Bold";
type Length = "Short" | "Medium" | "Long";

export default function GeneratePage() {
  const router = useRouter();

  const [platform, setPlatform] = useState<Platform>("Instagram");
  const [topic, setTopic] = useState("Фітнес");
  const [goal, setGoal] = useState("Залучити підписників");
  const [audience, setAudience] = useState("Спортсмени");
  const [tone, setTone] = useState<Tone>("Expert");
  const [length, setLength] = useState<Length>("Medium");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const payload = useMemo(
    () => ({ platform, topic, goal, audience, tone, length }),
    [platform, topic, goal, audience, tone, length]
  );

  async function onGenerate() {
    setError("");
    if (!topic.trim()) {
      setError("Тема — обов’язкова.");
      return;
    }

    setLoading(true);
    try {
      const r = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // важливо: додаємо трохи “шума”, щоб результат не повторювався
        body: JSON.stringify({ ...payload, nonce: Date.now() }),
      });

      const data = await r.json().catch(() => ({}));

      if (!r.ok || !data?.ok) {
        const msg =
          data?.error ||
          (r.status === 429
            ? "Ліміт OpenAI вичерпано (429). Перевір білінг/ліміти."
            : `Помилка генерації (${r.status}).`);
        throw new Error(msg);
      }

      // очікуємо data.text
      const text = String(data.text || "");
      if (!text) throw new Error("Порожня відповідь від AI.");

      // кладемо в sessionStorage (простий MVP)
      sessionStorage.setItem("ca_last_result", text);
      sessionStorage.setItem("ca_last_payload", JSON.stringify(payload));

      router.push("/result");
    } catch (e: any) {
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={card}>
        <h2 style={h2}>Створити пост</h2>
        <p style={muted}>Заповни коротко — і отримай готовий текст.</p>
      </div>

      <div style={card}>
        <label style={label}>Платформа</label>
        <Select value={platform} onChange={setPlatform} options={["Instagram", "Telegram", "LinkedIn"]} />

        <label style={label}>Тема (обов’язково)</label>
        <Input value={topic} onChange={setTopic} placeholder="Напр. Фітнес, Догляд за собакою, Ракова ферма…" />

        <label style={label}>Ціль</label>
        <Input value={goal} onChange={setGoal} placeholder="Напр. Залучити підписників / Продаж / Довіра" />

        <label style={label}>Аудиторія</label>
        <Input value={audience} onChange={setAudience} placeholder="Напр. Спортсмени / Новачки / Власники собак" />

        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
          <div>
            <label style={label}>Тон</label>
            <Select value={tone} onChange={setTone} options={["Expert", "Friendly", "Bold"]} />
          </div>
          <div>
            <label style={label}>Довжина</label>
            <Select value={length} onChange={setLength} options={["Short", "Medium", "Long"]} />
          </div>
        </div>

        {error ? <div style={errorBox}>{error}</div> : null}

        <button style={{ ...primaryBtn, opacity: loading ? 0.6 : 1 }} onClick={onGenerate} disabled={loading}>
          {loading ? "Генеруємо…" : "Згенерувати"}
        </button>

        <button style={ghostBtn} onClick={() => router.push("/dashboard")} disabled={loading}>
          ← Назад
        </button>
      </div>
    </div>
  );
}

/* ====== small UI helpers ====== */

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={input}
      autoComplete="off"
    />
  );
}

function Select<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: T[];
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value as T)} style={input}>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

/* ===== styles ===== */

const card: React.CSSProperties = {
  borderRadius: 18,
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.10)",
  padding: 14,
};

const h2: React.CSSProperties = { margin: 0, fontSize: 18, fontWeight: 900 };

const muted: React.CSSProperties = { marginTop: 6, fontSize: 13, opacity: 0.75 };

const label: React.CSSProperties = {
  display: "block",
  marginTop: 10,
  marginBottom: 6,
  fontSize: 12,
  opacity: 0.75,
};

const input: React.CSSProperties = {
  width: "100%",
  padding: 12,
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.05)",
  color: "rgba(255,255,255,0.92)",
  outline: "none",
};

const primaryBtn: React.CSSProperties = {
  marginTop: 12,
  width: "100%",
  padding: 14,
  borderRadius: 16,
  border: "1px solid rgba(46,204,113,0.35)",
  background: "linear-gradient(180deg, rgba(46,204,113,0.25), rgba(46,204,113,0.10))",
  color: "rgba(255,255,255,0.92)",
  fontWeight: 900,
  cursor: "pointer",
};

const ghostBtn: React.CSSProperties = {
  marginTop: 10,
  width: "100%",
  padding: 12,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "transparent",
  color: "rgba(255,255,255,0.80)",
  fontWeight: 800,
  cursor: "pointer",
};

const errorBox: React.CSSProperties = {
  marginTop: 12,
  padding: 12,
  borderRadius: 14,
  border: "1px solid rgba(231,76,60,0.35)",
  background: "rgba(231,76,60,0.10)",
  color: "rgba(255,255,255,0.90)",
  fontSize: 12,
  lineHeight: 1.35,
};
