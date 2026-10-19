"use client";

import TabBar from "./TabBar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      {children}
      <TabBar />
    </div>
  );
}
