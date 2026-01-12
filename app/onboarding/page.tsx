"use client";

import { useEffect, useState } from "react";

export default function OnboardingPage() {
  const [debug, setDebug] = useState({
    hasTelegram: false,
    hasWebApp: false,
    initDataLen: 0,
    auth: "not started" as string,
    click: "not clicked" as string,
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
    webApp.expand?.();

    // Telegram MainButton
    webApp.MainButton.setText("Почати");
    webApp.MainButton.show();

    const onClick = () => {
      setDebug((d) => ({ ...d, click: "clicked" }));
      window.location.assign("/dashboard");
    };

    webApp.MainButton.onClick(onClick);

    // Call auth
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
        setDebug((d) => ({ ...d, auth: `error: ${String(e)}` }));
      });

    return () => {
      webApp.MainButton.offClick(onClick);
      webApp.MainButton.hide();
    };
  }, []);

  return (
    <main style={{ padding: 16, display: "grid", gap: 10 }}>
      <h1 style={{ margin: 0 }}>Creative Agent</h1>

      <div style={{ fontSize: 12, opacity: 0.85, lineHeight: 1.4 }}>
        <div><b>DEBUG</b></div>
        <div>window.Telegram: {debug.hasTelegram ? "YES" : "NO"}</div>
        <div>WebApp: {debug.hasWebApp ? "YES" : "NO"}</div>
        <div>initData length: {debug.initDataLen}</div>
        <div>auth: {debug.auth}</div>
        <div>main button click: {debug.click}</div>
      </div>

      <p style={{ margin: 0 }}>Якщо ти у Telegram, знизу має з’явитись кнопка “Почати”.</p>
      <p style={{ margin: 0, opacity: 0.8 }}>Кнопки всередині сторінки ігноруємо.</p>
    </main>
  );
}

