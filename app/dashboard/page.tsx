import Link from "next/link";

export default function DashboardPage() {
  return (
    <main style={{ padding: 24, display: "grid", gap: 12 }}>
      <h1 style={{ margin: 0 }}>Dashboard</h1>
      <p style={{ margin: 0 }}>Що створимо сьогодні?</p>

      <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
        <Link href="/generate">
          <button style={{ padding: 12, width: "100%" }}>✍️ Створити пост</button>
        </Link>

        <Link href="/paywall">
          <button style={{ padding: 12, width: "100%" }}>⭐ PRO</button>
        </Link>

        <Link href="/settings">
          <button style={{ padding: 12, width: "100%" }}>⚙️ Налаштування</button>
        </Link>

        <Link href="/onboarding">
          <button style={{ padding: 12, width: "100%" }}>← Назад</button>
        </Link>
      </div>
    </main>
  );
}

