"use client";

import { useEffect, useMemo, useState } from "react";

type Src = "onboarding" | "dashboard" | "unknown";

export default function PaywallPage() {
  const [src, setSrc] = useState<Src>("unknown");
  const [isTelegram, setIsTelegram] = useState(false);

  useEffect(() => {
    // Read src from query
    const params = new URLSearchParams(window.location.search);
    const s = (params.get("src") || "").toLowerCase();
    if (s === "onboarding" || s === "dashboard") setSrc(s);
    else setSrc("unknown");
  }, []);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    setIsTelegram(!!tg);

    if (!tg) return;

    tg.ready();
    tg.expand?.();

    // MainButton: "Оформити PRO"
    tg.MainButton?.setText?.("Оформити PRO");
    tg.MainButton?.show?.();

    const onClick = () => {
      // Поки що — демо. Потім підключимо оплату (Telegram Payments/Stripe)
      tg.MainButton?.showProgress?.();
      setTimeout(() => {
        tg.MainButton?.hideProgress?.();
        tg.showPopup?.({
          title: "PRO (Demo)",
          message: "Платіжний флоу підключимо наступним кроком.",
          buttons: [{ type: "ok" }],
        });
      }, 450);
    };

    tg.MainButton?.onClick?.(onClick);

    return () => {
      tg.MainButton?.offClick?.(onClick);
      tg.MainButton?.hide?.();
    };
  }, []);

  const headline =
    src === "onboarding"
      ? "Розблокуй PRO та стартуй швидше"
      : src === "dashboard"
      ? "PRO дає максимум можливостей"
      : "PRO підписка";

  const sub =
    src === "onboarding"
      ? "Готові шаблони, більше генерацій та швидші результати."
      : src === "dashboard"
      ? "Прокачай генератор контенту та зеконом час щодня."
      : "Розширені функції для створення контенту.";

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div style={styles.brandRow}>
          <div style={styles.logo}>CA</div>
          <div style={{ display: "grid", gap: 2 }}>
            <h1 style={styles.title}>PRO</h1>
            <div style={styles.subtitle}>Creative Agent</div>
          </div>
        </div>

        <div style={styles.pill}>
          <span style={styles.pillDot} />
          <span>{isTelegram ? "Telegram" : "Browser"}</span>
          <span style={{ opacity: 0.7 }}>•</span>
          <span style={{ opacity: 0.85 }}>src: {src}</span>
        </div>
      </header>

      <section style={styles.hero}>
        <h2 style={styles.heroTitle}>{headline}</h2>
        <p style={styles.heroSub}>{sub}</p>

        <div style={styles.priceRow}>
          <div style={styles.priceBox}>
            <div style={styles.price}>$9.99</div>
            <div style={styles.priceNote}>/ місяць</div>
          </div>

          <div style={styles.badge}>⭐ Найпопулярніше</div>
        </div>
      </section>

      <section style={styles.cards}>
        <Feature title="♾️ Більше генерацій" desc="Підписка знімає ліміти базового плану." />
        <Feature title="⚡ Швидші сценарії" desc="Готові промти, шаблони, рубрики, плани контенту." />
        <Feature title="🎯 Краще під бренд" desc="Тон, стиль, структура постів під твою нішу." />
      </section>

      <section style={styles.actions}>
        <button
          style={styles.secondaryBtn}
          onClick={() => (window.location.href = `${window.location.origin}/dashboard`)}
        >
          ← Назад
        </button>

        <div style={styles.helper}>
          {isTelegram
            ? "Натисни кнопку “Оформити PRO” внизу (Telegram MainButton)."
            : "Відкрий Mini App у Telegram, щоб оформити PRO через вбудований платіж."}
        </div>
      </section>

      <footer style={styles.footer}>
        <span style={{ opacity: 0.65 }}>© {new Date().getFullYear()} Creative Agent</span>
      </footer>
    </main>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
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
      "radial-gradient(1100px 600px at 15% 0%, rgba(241, 196, 15, 0.12), transparent 60%), radial-gradient(900px 500px at 90% 10%, rgba(52, 152, 219, 0.16), transparent 55%), #0b0f14",
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
  brandRow: {
    display: "flex",
    gap: 12,
    alignItems: "center",
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 14,
    display: "grid",
    placeItems: "center",
    fontWeight: 800,
    letterSpacing: 0.5,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.10)",
  },
  title: {
    margin: 0,
    fontSize: 20,
    fontWeight: 900,
    lineHeight: 1.1,
  },
  subtitle: {
    fontSize: 12,
    opacity: 0.75,
    lineHeight: 1.3,
  },
  pill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.06)",
    fontSize: 12,
    opacity: 0.9,
  },
  pillDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    background: "rgba(255,255,255,0.85)",
  },
  hero: {
    borderRadius: 18,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    padding: 14,
    display: "grid",
    gap: 10,
  },
  heroTitle: {
    margin: 0,
    fontSize: 18,
    fontWeight: 900,
  },
  heroSub: {
    margin: 0,
    fontSize: 13,
    lineHeight: 1.35,
    opacity: 0.8,
  },
  priceRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 4,
  },
  priceBox: {
    display: "flex",
    alignItems: "baseline",
    gap: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: 950,
    letterSpacing: -0.5,
  },
  priceNote: {
    fontSize: 13,
    opacity: 0.75,
  },
  badge: {
    padding: "8px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(241, 196, 15, 0.12)",
    fontSize: 12,
    fontWeight: 800,
  },
  cards: {
    display: "grid",
    gap: 10,
  },
  card: {
    borderRadius: 18,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    padding: 14,
  },
  cardTitle: {
    fontWeight: 900,
    fontSize: 14,
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 13,
    lineHeight: 1.35,
    opacity: 0.8,
  },
  actions: {
    display: "grid",
    gap: 10,
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
  helper: {
    fontSize: 12,
    opacity: 0.75,
    lineHeight: 1.35,
  },
  footer: {
    marginTop: 6,
    fontSize: 12,
    textAlign: "center",
  },
};

