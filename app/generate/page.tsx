"use client";

import { useEffect, useState } from "react";

export default function GeneratePage() {
  const [platform, setPlatform] = useState("telegram");
  const [topic, setTopic] = useState("");
  const [goal, setGoal] = useState("");
  const [tone, setTone] = useState("friendly");
  const [audience, setAudience] = useState("");
  const [length, setLength] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (!tg) return;

    tg.ready();
    tg.expand?.();
    tg.MainButton?.setText?.("Згенерувати");
    tg.MainButton?.show?.();

    const onClick = () => {
      (document.getElementById("ca-generate-btn") as HTMLButtonElement | null)?.click();
    };

    tg.MainButton?.onClick?.(onClick);

    return () => {
      tg.MainButton?.offClick?.(onClick);
      tg.MainButton?.hide?.();
    };
  }, []);

  const submit = async () => {
    setError(null);

    if (!topic.trim()) {
      setError("Вкажи тему.");
      return;
    }

    setLoading(true);
    try {
      const r = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          topic,
          goal,
          tone,
          audience,
          length,
          lang: "uk",
        }),
      });

      const data = await r.json();
      if (!r.ok || !data?.ok) throw new Error(data?.error || "Generation failed");

      // Збережемо результат для сторінки /result
      sessionStorage.setItem("ca_last_result", data.text || "");
      window.location.href = `${window.location.origin}/result`;
    } catch (e: any) {
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div style={styles.brandRow}>
          <div style={styles.logo}>CA</div>
          <div style={{ display: "grid", gap: 2 }}>
            <h1 style={styles.title}>Створити пост</h1>
            <div style={styles.subtitle}>Заповни коротко — я згенерую текст.</div>
          </div>
        </div>
      </header>

      <section style={styles.card}>
        <label style={styles.label}>Платформа</label>
        <select style={styles.input} value={platform} onChange={(e) => setPlatform(e.target.value)}>
          <option value="telegram">Telegram</option>
          <option value="instagram">Instagram</option>
          <option value="linkedin">LinkedIn</option>
        </select>

        <label style={styles.label}>Тема (обовʼязково)</label>
        <input
          style={styles.input}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Напр: 5 помилок у догляді за собакою взимку"
        />

        <label style={styles.label}>Ціль</label>
        <input
          style={styles.input}
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Напр: залучити підписників / продати консультацію"
        />

        <label style={styles.label}>Аудиторія</label>
        <input
          style={styles.input}
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          placeholder="Напр: власники собак-початківці"
        />

        <label style={styles.label}>Тон</label>
        <select style={styles.input} value={tone} onChange={(e) => setTone(e.target.value)}>
          <option value="friendly">Friendly</option>
          <option value="expert">Expert</option>
          <option value="bold">Bold</option>
        </select>

        <label style={styles.label}>Довжина</label>
        <select style={styles.input} value={length} onChange={(e) => setLength(e.target.value)}>
          <option value="short">Short</option>
          <option value="medium">Medium</option>
          <option value="long">Long</option>
        </select>

        {error && <div style={styles.error}>{error}</div>}

        <button
          id="ca-generate-btn"
          style={styles.primaryBtn}
          onClick={submit}
          disabled={loading}
        >
          {loading ? "Генерую…" : "Згенерувати"}
        </button>

        <button
          style={styles.secondaryBtn}
          onClick={() => (window.location.href = `${window.location.origin}/dashboard`)}
        >
          ← Назад
        </button>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(1200px 600px at 20% 0%, rgba(46, 204, 113, 0.10), transparent 60%), radial-gradient(900px 500px at 90% 10%, rgba(52, 152, 219, 0.16), transparent 55%), #0b0f14",
    color: "rgba(255,255,255,0.92)",
    padding: 20,
    display: "grid",
    gap: 16,
    alignContent: "start",
  },
  header: { display: "flex", gap: 12, alignItems: "center" },
  brandRow: { display: "flex", gap: 12, alignItems: "center" },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 14,
    display: "grid",
    placeItems: "center",
    fontWeight: 900,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.10)",
  },
  title: { margin: 0, fontSize: 20, fontWeight: 900, lineHeight: 1.1 },
  subtitle: { fontSize: 12, opacity: 0.75, lineHeight: 1.3 },
  card: {
    borderRadius: 18,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    padding: 14,
    display: "grid",
    gap: 10,
  },
  label: { fontSize: 12, opacity: 0.8 },
  input: {
    padding: 12,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.06)",
    color: "rgba(255,255,255,0.92)",
    outline: "none",
  },
  primaryBtn: {
    width: "100%",
    padding: 12,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.14)",
    color: "rgba(255,255,255,0.95)",
    fontWeight: 950,
    fontSize: 14,
    marginTop: 6,
  },
  secondaryBtn: {
    width: "100%",
    padding: 12,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.08)",
    color: "rgba(255,255,255,0.92)",
    fontWeight: 900,
    fontSize: 14,
  },
  error: {
    fontSize: 12,
    color: "rgba(231, 76, 60, 0.95)",
    background: "rgba(231, 76, 60, 0.10)",
    border: "1px solid rgba(231, 76, 60, 0.25)",
    padding: 10,
    borderRadius: 14,
  },
};
