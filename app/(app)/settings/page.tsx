import Link from "next/link";

export default function SettingsPage() {
  return (
    <main style={{ padding: 24, display: "grid", gap: 12 }}>
      <h1 style={{ margin: 0 }}>Налаштування</h1>

      <label style={{ display: "grid", gap: 6 }}>
        Мова
        <select style={{ padding: 10 }}>
          <option>Українська</option>
          <option>English</option>
        </select>
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        Стиль за замовчуванням
        <select style={{ padding: 10 }}>
          <option>Експертний</option>
          <option>Дружній</option>
          <option>Продаючий</option>
          <option>Креативний</option>
        </select>
      </label>

      <Link href="/dashboard">
        <button style={{ padding: 12, width: "100%" }}>← Назад</button>
      </Link>
    </main>
  );
}
