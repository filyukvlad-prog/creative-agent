"use client";

import { useEffect, useState } from "react";

type DebugState = {
  hasTelegram: boolean;
  hasWebApp: boolean;
  initDataLen: number;
  auth: string;
  click: string;
};

export default function OnboardingPage() {
  const [debug, setDebug] = useState<DebugState>({
    hasTelegram: false,
    hasWebApp: false,
    initDataLen: 0,
    auth: "not started",
    click: "not clicked",
  });

  useEffect(() => {
    const tg = (window as any).Telegram;
    const webApp = tg?.WebApp;

    setDebug((d) => ({
      ...d,
      hasTelegram: !!tg,
      hasWebApp: !!webApp,
      initDataLen: (webApp?.initData?.length || 0),
    }));

    if (!webApp) return;

    webApp.ready();
    if (typeof webApp.expand === "function") webApp.expand();

    // Якщо initData порожній — значить відкрито не через правильний Telegram WebApp контекст
    // (тут ми лише показуємо це в debug; auth тоді, звісно, не спрацює)
    setDebug((d) => ({ ...d, auth: "calling /api/auth/telegram..." }));

    fetch("/api/auth/telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData: webApp.initData }),
    })
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        setDebug((d) => ({
          ...d,
          auth: `response: ${r.status} ${JSON.stringify(data)}`,
        }));
      })
      .catch((e) => {
        setDebug((d) => ({
          ...d,
          auth: `error: ${String(e)}`,
        }));
      });

    const onClick = () => {
      setDebug((d) => ({ ...d, click: "clicked" }));
      try {
        webApp.MainButton?.disable?.();
      } catch {}
      // Абсолютний URL — стабільніше на iOS Telegram
      window.location.href = `${window.location.origin}/dashboard`;
    };

    // Telegram MainButton (працює тільки всередині Telegram WebApp)
    if (webApp.MainButton) {
      webApp.MainButton.setText("Почати");
      webApp.MainButton.show();
      webApp.MainButton.onClick(onClick);
    }

    return () => {
      try {
        webApp.MainButton?.offClick?.(onClick);
        webApp.MainButton?.hide?.();
      } catch {}
    };
  }, []);

  return (
    <main style={{ padding: 16, display: "grid", gap: 10 }}>
      <h1 style={{ margin: 0 }}>Creative Agent</h1>

      <div style={{ fontSize: 12, opacity: 0.85, lineHeight: 1.4 }}>
        <div>
          <b>DEBUG</b>
        </div>
        <div>window.Telegram: {debug.hasTelegram ? "YES" : "NO"}</div>
        <div>WebApp: {debug.hasWebApp ? "YES" : "NO"}</div>
        <div>initData length: {debug.initDataLen}</div>
        <div>auth: {debug.auth}</div>
        <div>main button click: {debug.click}</div>
      </div>

      <p style={{ opacity: 0.7, fontSize: 12 }}>build: v-onboarding-20260112-1</p>

      <p style={{ margin: 0 }}>
        Якщо ти у Telegram, знизу має з’явитись кнопка “Почати”.
      </p>

      <p style={{ margin: 0, opacity: 0.8 }}>
        Якщо initData length = 0, відкрий Mini App саме через бота (кнопка в чаті / direct link
        з <code>?startapp=...</code>).
      </p>

      {/* Тимчасовий fallback для тестів */}
      <button
        onClick={() => (window.location.href = `${window.location.origin}/dashboard`)}
        style={{ padding: 12, width: "100%" }}
      >
        Почати (fallback)
      </button>
    </main>
  );
}

