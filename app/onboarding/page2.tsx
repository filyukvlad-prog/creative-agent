"use client";

import { useEffect } from "react";

export default function OnboardingPage() {
  useEffect(() => {
  const tg = window.Telegram?.WebApp as any;
  if (!tg) return;

  tg.ready();

  tg.MainButton.setText("Почати");
  tg.MainButton.show();

  const onClick = () => {
    window.location.href = "/dashboard";
  };

  tg.MainButton.onClick(onClick);

  return () => {
    tg.MainButton.offClick(onClick);
    tg.MainButton.hide();
  };
}, []);
  return (
    <main style={{ padding: 24 }}>
      <h1>Creative Agent</h1>
      <p>Твій AI-агент для контенту та ідей у Telegram.</p>
      {/* ❗ НЕ ПОТРІБНО кнопки тут */}
    </main>
  );
}


