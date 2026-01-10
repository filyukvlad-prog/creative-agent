import Link from "next/link";

export default function GeneratePage() {
  return (
    <main style={{ padding: 24, display: "grid", gap: 12 }}>
      <h1 style={{ margin: 0 }}>Generator</h1>

      <label style={{ display: "grid", gap: 6 }}>
        Ніша
        <input
          placeholder="Напр.: фітнес, бізнес, Etsy"
          style={{ padding: 10 }}
        />
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        Стиль
        <select style={{ padding: 10 }}>
          <option>Експертний</option>
          <option>Дружній</option>
          <option>Продаючий</option>
          <option>Креативний</option>
        </select>
      </label>

      <Link href="/result">
        <button style={{ padding: 12, width: "100%", marginTop: 8 }}>
          ⚡ Згенерувати
        </button>
      </Link>

      <Link href="/dashboard">
        <button style={{ padding: 12, width: "100%" }}>← Назад</button>
      </Link>
    </main>
  );
}
