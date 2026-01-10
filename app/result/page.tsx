import Link from "next/link";

export default function ResultPage() {
  return (
    <main style={{ padding: 24, display: "grid", gap: 12 }}>
      <h1 style={{ margin: 0 }}>Готово 🚀</h1>
      <p style={{ margin: 0 }}>Ось твій контент (поки демо-текст):</p>

      <div
        style={{
          padding: 12,
          border: "1px solid #333",
          borderRadius: 12
        }}
      >
        Сьогодні коротка порада: зроби 1 маленьку дію, яка наблизить тебе до мети.
        Потім повтори завтра. Послідовність перемагає мотивацію.
      </div>

      <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
        <button style={{ padding: 12, width: "100%" }}>📋 Копіювати</button>

        <Link href="/generate">
          <button style={{ padding: 12, width: "100%" }}>🔁 Перегенерувати</button>
        </Link>

        <Link href="/paywall">
          <button style={{ padding: 12, width: "100%" }}>⭐ Отримати PRO</button>
        </Link>

        <Link href="/dashboard">
          <button style={{ padding: 12, width: "100%" }}>🏠 На головну</button>
        </Link>
      </div>
    </main>
  );
}
