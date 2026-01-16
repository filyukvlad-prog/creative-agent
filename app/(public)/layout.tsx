// app/(public)/layout.tsx
import type { ReactNode } from "react";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "#050607", color: "white" }}>
      {children}
    </div>
  );
}