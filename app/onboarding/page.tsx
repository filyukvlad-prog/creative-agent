"use client";

import { useEffect, useState } from "react";

type Status = "not-telegram" | "authing" | "ready" | "error";

export default function OnboardingPage() {
  const [status, setStatus] = useState<Status>("authing");

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;

    if (!tg) {
      setStatus("not-telegram");
      return;
    }

    tg.ready();
    tg.expand?.();

    // Main button
    tg.MainButton?.setText?.("Почати");
    tg.MainButton?.show?.();
    tg.MainButton?.disable?.();

    setStatus("authing");

    fetch("/api/auth/telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData: tg.initData }),
    })
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok || !data?.ok) throw new Error(data?.error || "Auth failed");

        setStatus("ready");
        tg.MainButton?.enable?.();
      })
      .catch(() => {
        setStatus("error");
        tg.MainButton?.hide?.();
      });

    const onClick = () => {
      tg.MainButton?.disable?.();
      window.location.href = `${window.location.origin}/dashboard`;
    };

    tg.MainButton?.onClick?.(onClick);

    return () => {
      tg.MainButton?.offClick?.(onClick);
      tg.MainButton?.hide?.();
    };
  }, []);

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div style={styles.brandRow}>
          <div style={styles.logo}>CA</div>
          <div style={{ display: "grid", gap: 2 }}>
            <h1 style={styles.title}>Creative Agent</h1>
            <div style={styles.subtitle}>AI-агент для контенту та ідей у Telegram</div>
          </div>
        </div>
      </header>

      <section style={styles.cards}>
        <Card title="✍️ Пости" desc="Ідеї, структура, CTA — під твою нішу." />
        <Card title="📦 Плани" desc="План на тиждень/місяць, рубрики та серії." />
        <Card title="🎯 Стиль" desc="Під твій бренд: коротко, експертно або лайтово." />
      </section>

      <section style={styles.statusBox}>
        {status === "authing" && <div style={styles.helper}>Підключаємо Telegram…</div>}
        {status === "ready" && (
          <div style={styles.helper}>
            Готово. Натисни <b>“Почати”</b> внизу.
          </div>
        )}
        {status === "error" && (
          <div style={styles.helper}>
            Не вдалося підтвердити сесію. Закрий Mini App і відкрий знову через бота.
          </div>
        )}
        {status === "not-telegram" && (
          <div style={styles.helper}>
            Відкрий Mini App через Telegram-бота (direct link з <code>?startapp=...</code>).
          </div>
        )}
      </section>

      <section style={styles.actions}>
        <button
          style={styles.secondaryBtn}
          onClick={() =>
            (window.location.href = `${window.location.origin}/paywall?src=onboarding`)
          }
        >
          ⭐ PRO
        </button>
      </section>

      <footer style={styles.footer}>
        <span style={{ opacity: 0.65 }}>© {new Date().getFullYear()} Creative Agent</span>
      </footer>
    </main>
  );
}

function Card({ title, desc }: { title: string; desc: string }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardTitle}>{title}</div>
      <div style={styles.cardDesc}>{desc}</div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(1200px 600px at 20% 0%, rgba(46, 204, 113, 0.12), transparent 60%), radial-gradient(900px 500px at 90% 10%, rgba(52, 152, 219, 0.16), transparent 55%), #0b0f14",
    color: "rgba(255,255,255,0.92)",
    padding: 20,
    display: "grid",
    gap: 16,
    alignContent: "start",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  brandRow: { display: "flex", gap: 12, alignItems: "center" },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 14,
    display: "grid",
    placeItems: "center",
    fontWeight: 900,
    letterSpacing: 0.5,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.10)",
  },
  title: { margin: 0, fontSize: 20, fontWeight: 900, lineHeight: 1.1 },
  subtitle: { fontSize: 12, opacity: 0.75, lineHeight: 1.3 },
  cards: { display: "grid", gap: 10 },
  card: {
    borderRadius: 18,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    padding: 14,
  },
  cardTitle: { fontWeight: 900, fontSize: 14, marginBottom: 6 },
  cardDesc: { fontSize: 13, lineHeight: 1.35, opacity: 0.8 },
  statusBox: {
    borderRadius: 18,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    padding: 14,
  },
  helper: { fontSize: 12, opacity: 0.8, lineHeight: 1.35 },
  actions: { display: "grid", gap: 10 },
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
  footer: { marginTop: 6, fontSize: 12, textAlign: "center" },
};


