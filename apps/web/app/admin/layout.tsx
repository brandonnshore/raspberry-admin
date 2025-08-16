export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr]">
      {/* Sidebar */}
      <aside className="bg-[var(--panel)] border-r border-white/5 p-4">
        <div className="text-lg font-semibold mb-6">Raspberry Admin</div>
        <nav className="grid gap-2 text-sm">
          <a className="px-2 py-2 rounded hover:bg-white/5" href="/admin">Products</a>
          {/* add more later: Orders, Customers, Discounts */}
        </nav>
      </aside>

      {/* Main */}
      <div className="p-6">
        <header className="flex items-center justify-between">
          <div className="text-xl font-semibold">Products</div>
          <div className="text-xs text-[var(--muted)]">API: {process.env.NEXT_PUBLIC_API_URL}</div>
        </header>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
