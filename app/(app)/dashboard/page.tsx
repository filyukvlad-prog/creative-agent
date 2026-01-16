"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (!tg) return;

    tg.ready();
    tg.expand?.();

    // Primary CTA
    tg.MainButton.setText("✍️ Створити пост");
    tg.MainButton.show();
    tg.MainButton.enable();

    const onClick = () => {
      tg.MainButton.disable();
      router.push("/generate");
    };

    tg.MainButton.onClick(onClick);

    return () => {
      tg.MainButton.offClick(onClick);
      tg.MainButton.hide();
    };
  }, [router]);

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={card}>
        <h2 style={h2}>Що створимо сьогодні?</h2>
        <p style={muted}>
          Ідеї, структура та CTA — під Instagram / Telegram / LinkedIn.
        </p>
      </div>

      <button style={primaryCard} onClick={() => router.push("/generate")}>
        ✍️ Створити пост
        <div style={hint}>Основний сценарій</div>
      </button>

      <div style={card}>
        <div style={item} onClick={() => router.push("/generate")}>
          <div>
            <b>⚡ Пости за 30 секунд</b>
            <div style={mutedSmall}>
              Коротко, структуровано, з CTA
            </div>
          </div>
        </div>

        <div style={divider} />

        <div style={item} onClick={() => alert("PRO у розробці")}>
          <div>
            <b>📦 Пакети контенту</b>
            <div style={mutedSmall}>
              Серії постів, рубрики, план
            </div>
          </div>
          <span style={pro}>PRO</span>
        </div>

        <div style={divider} />

        <div style={item} onClick={() => router.push("/settings")}>
          <div>
            <b>⚙️ Налаштування</b>
            <div style={mutedSmall}>
              Мова, стиль, тон
            </div>
          </div>
        </div>
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

const primaryCard: React.CSSProperties = {
  ...card,
  padding: 18,
  cursor: "pointer",
  background: "linear-gradient(180deg, rgba(46,204,113,0.25), rgba(46,204,113,0.10))",
  border: "1px solid rgba(46,204,113,0.35)",
  fontWeight: 900,
  fontSize: 16,
  textAlign: "left",
};

const hint: React.CSSProperties = {
  marginTop: 6,
  fontSize: 12,
  opacity: 0.75,
};

const h2: React.CSSProperties = {
  margin: 0,
  fontSize: 18,
  fontWeight: 900,
};

const muted: React.CSSProperties = {
  marginTop: 6,
  fontSize: 13,
  opacity: 0.75,
};

const mutedSmall: React.CSSProperties = {
  marginTop: 4,
  fontSize: 12,
  opacity: 0.7,
};

const item: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  cursor: "pointer",
};

const divider: React.CSSProperties = {
  height: 1,
  background: "rgba(255,255,255,0.08)",
  margin: "12px 0",
};

const pro: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  padding: "4px 8px",
  borderRadius: 999,
  background: "rgba(255,215,0,0.15)",
  border: "1px solid rgba(255,215,0,0.35)",
};
