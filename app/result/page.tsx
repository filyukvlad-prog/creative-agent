"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResultPage() {
  const router = useRouter();

  const initial = useMemo(() => {
    const text = sessionStorage.getItem("ca_last_result") || "";
    const payloadStr = sessionStorage.getItem("ca_last_payload") || "{}";
    let payload: any = {};
    try {
      payload = JSON.parse(payloadStr);
    } catch {}
    return { text, payload };
  }, []);

  const [text, setText] = useState(initial.text);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string>("");

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setMsg("Скопійовано ✅");
      setTimeout(() => setMsg(""), 1200);
    } catch {
      setMsg("Не вдалося скопіювати");
      setTimeout(() => setMsg(""), 1200);
    }
  }

  async function regenerate() {
    setMsg("");
    setLoading(true);
    try {
      const r = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...(initial.payload || {}), nonce: Date.now() }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || !data?.ok) throw new Error(data?.error || `Помилка (${r.status})`);

      const next = String(data.text || "");
      if (!next) throw new Error("Порожня відповідь від AI.");

      setText(next);
      sessionStorage.setItem("ca_last_result", next);
      setMsg("Оновлено ✅");
      setTimeout(() => setMsg(""), 1200);
    } catch (e: any) {
      setMsg(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={card}>
        <h2 style={h2}>Готово 🚀</h2>
        <p style={muted}>Ось твій контент. Можеш одразу копіювати.</p>
      </div>

      <div style={card}>
        <div style={resultBox}>{text || "Немає тексту. Повернись і згенеруй пост."}</div>

        {msg ? <div style={info}>{msg}</div> : null}

        <button style={primaryBtn} onClick={copy} disabled={!text}>
          📋 Копіювати
        </button>

        <button style={{ ...ghostBtn, opacity: loading ? 0.6 : 1 }} onClick={regenerate} disabled={loading}>
          🔁 Перегенерувати
        </button>

        <button style={proBtn} onClick={() => alert("PRO у розробці")}>
          ⭐ Отримати PRO
        </button>

        <button style={ghostBtn} onClick={() => router.push("/dashboard")}>
          🏠 На головну
        </button>
      </div>
    </div>
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

const resultBox: React.CSSProperties = {
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(0,0,0,0.25)",
  padding: 14,
  fontSize: 14,
  lineHeight: 1.45,
  whiteSpace: "pre-wrap",
};

const info: React.CSSProperties = {
  marginTop: 10,
  fontSize: 12,
  opacity: 0.8,
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

const proBtn: React.CSSProperties = {
  marginTop: 10,
  width: "100%",
  padding: 12,
  borderRadius: 16,
  border: "1px solid rgba(255,215,0,0.35)",
  background: "rgba(255,215,0,0.10)",
  color: "rgba(255,255,255,0.92)",
  fontWeight: 900,
  cursor: "pointer",
};

