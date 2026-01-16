// app/(app)/layout.tsx
import type { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(1200px 800px at 30% -10%, rgba(35, 155, 180, .25), transparent 60%), radial-gradient(900px 700px at 110% 10%, rgba(180, 160, 70, .18), transparent 55%), linear-gradient(180deg, #070A0C 0%, #050607 100%)",
        color: "rgba(255,255,255,.92)",
        fontFamily:
          '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Inter,Arial,sans-serif',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          background: "rgba(0,0,0,.28)",
          borderBottom: "1px solid rgba(255,255,255,.08)",
        }}
      >
        <div
          style={{
            maxWidth: 520,
            margin: "0 auto",
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,.12)",
              background: "rgba(255,255,255,.06)",
              display: "grid",
              placeItems: "center",
              fontWeight: 700,
              letterSpacing: ".4px",
            }}
          >
            CA
          </div>

          <div style={{ display: "grid", gap: 2 }}>
            <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.1 }}>
              Creative Agent
            </div>
            <div style={{ fontSize: 12, opacity: 0.75 }}>
              AI-агент для контенту та ідей у Telegram
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main style={{ maxWidth: 520, margin: "0 auto", padding: "16px 16px 28px" }}>
        {children}

        <div style={{ marginTop: 18, opacity: 0.5, fontSize: 12, textAlign: "center" }}>
          © {new Date().getFullYear()} Creative Agent
        </div>
      </main>
    </div>
  );
}