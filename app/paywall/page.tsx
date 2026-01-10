import Link from "next/link";

export default function PaywallPage() {
  return (
    <main style={{ padding: 24, display: "grid", gap: 12 }}>
      <h1 style={{ margin: 0 }}>Creative Agent PRO</h1>
      <p style={{ margin: 0 }}>Створюй контент без обмежень.</p>

      <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
        <li>Безліміт генерацій</li>
        <li>Усі платформи</li>
        <li>Усі стилі та мови</li>
        <li>Історія та збереження</li>
      </ul>

      <div style={{ marginTop: 8, fontSize: 18 }}>
        <strong>$9 / місяць</strong>
      </div>

      <button style={{ padding: 12, width: "100%" }}>
        🚀 Оформити PRO (демо)
      </button>

      <Link href="/dashboard">
        <button style={{ padding: 12, width: "100%" }}>🔙 Пізніше</button>
      </Link>
    </main>
  );
}
