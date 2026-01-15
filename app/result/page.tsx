"use client";

import { useEffect, useState } from "react";

export default function ResultPage() {
  const [text, setText] = useState("");

  useEffect(() => {
    setText(sessionStorage.getItem("ca_last_result") || "");
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      const tg = (window as any).Telegram?.WebApp;
      tg?.showToast?.("Скопійовано") || tg?.showPopup?.({ message: "Скопійовано", buttons: [{ type: "ok" }] });
    } catch {
      // ignore
    }
  };

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div style={styles.brandRow}>
          <div style={styles.logo}>CA</div>
          <div style={{ display: "grid", gap: 2 }}>
            <h1 style={styles.title}>Результат</h1>
            <div style={styles.subtitle}>Готово. Можеш відредагувати і скопіювати.</div>
          </div>
        </div>
      </header>

      <section style={styles.card}>
        <textarea style={styles.textarea} value={text} onChange={(e) => setText(e.target.value)} />

        <button style={styles.primaryBtn} onClick={copy} disabled={!text}>
          Copy
        </button>

        <button
          style={styles.secondaryBtn}
          onClick={() => (window.location.href = `${window.location.origin}/generate`)}
        >
          ← Назад до генерації
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
  textarea: {
    minHeight: 340,
    padding: 12,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.06)",
    color: "rgba(255,255,255,0.92)",
    outline: "none",
    resize: "vertical",
    lineHeight: 1.4,
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
};

