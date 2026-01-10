"use client";

import { useEffect } from "react";

import Link from "next/link";

export default function OnboardingPage() {
  useEffect(() => {
  if (typeof window !== "undefined" && window.Telegram?.WebApp) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
  }
}, []);

    return (
    <main style={{ padding: 24, display: "grid", gap: 12 }}>
      <h1 style={{ margin: 0 }}>Creative Agent</h1>
      <p style={{ margin: 0 }}>
        Твій AI-агент для контенту та ідей у Telegram.
      </p>

      <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
        <Link href="/dashboard">
          <button style={{ padding: 12, width: "100%" }}>Почати</button>
        </Link>

        <Link href="/settings">
          <button style={{ padding: 12, width: "100%" }}>Налаштування</button>
        </Link>
      </div>
    </main>
  );
}

