'use client';

import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type Product = {
  id: string;
  title: string;
  priceCents: number;
  sku?: string | null;
  status: string;
  inventory: number;
  createdAt: string;
};

export default function AdminClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [priceCents, setPriceCents] = useState('');
  const [sku, setSku] = useState('');

  async function load() {
    setLoading(true);
    const r = await fetch(`${API}/products`, { cache: 'no-store' });
    const data = await r.json();
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  async function createProduct(e: React.FormEvent) {
    e.preventDefault();
    const body = { title, priceCents: Number(priceCents || 0), sku: sku || undefined, status: 'ACTIVE', inventory: 10 };
    await fetch(`${API}/products`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setTitle(''); setPriceCents(''); setSku('');
    await load();
  }

  async function remove(id: string) {
    await fetch(`${API}/products/${id}`, { method: 'DELETE' });
    await load();
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-6">
      {/* Create form card */}
      <section className="bg-[var(--panel)] border border-white/5 rounded-2xl p-5">
        <h2 className="text-lg font-semibold mb-4">Create product</h2>
        <form onSubmit={createProduct} className="grid gap-3 sm:grid-cols-[1fr_160px_160px_auto]">
          <input
            className="bg-black/20 border border-white/10 rounded-lg px-3 py-2"
            placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <input
            className="bg-black/20 border border-white/10 rounded-lg px-3 py-2"
            placeholder="Price (cents)" value={priceCents} onChange={e => setPriceCents(e.target.value)} />
          <input
            className="bg-black/20 border border-white/10 rounded-lg px-3 py-2"
            placeholder="SKU (optional)" value={sku} onChange={e => setSku(e.target.value)} />
          <button
            className="bg-[var(--accent)] text-black font-semibold rounded-lg px-4 py-2 hover:opacity-90 active:opacity-80"
            type="submit">
            Add
          </button>
        </form>
      </section>

      {/* Products table card */}
      <section className="bg-[var(--panel)] border border-white/5 rounded-2xl">
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Products</h2>
          {!loading && <div className="text-xs text-[var(--muted)]">{products.length} item(s)</div>}
        </div>

        {loading ? (
          <div className="p-5 text-[var(--muted)]">Loading…</div>
        ) : products.length === 0 ? (
          <div className="p-5 text-[var(--muted)]">No products yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-[var(--muted)]">
                <tr className="[&>th]:px-5 [&>th]:py-3">
                  <th>Title</th>
                  <th>SKU</th>
                  <th className="text-right">Price</th>
                  <th className="text-right">Inventory</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="[&>tr]:border-t [&>tr]:border-white/5">
                {products.map((p) => (
                  <tr key={p.id} className="[&>td]:px-5 [&>td]:py-3">
                    <td className="font-medium">{p.title}</td>
                    <td className="text-[var(--muted)]">{p.sku || '—'}</td>
                    <td className="text-right">${(p.priceCents / 100).toFixed(2)}</td>
                    <td className="text-right">{p.inventory}</td>
                    <td>
                      <span className="inline-flex items-center gap-2">
                        <span className={`inline-block h-2 w-2 rounded-full ${p.status === 'ACTIVE' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => remove(p.id)}
                        className="text-red-300 hover:text-red-200 underline underline-offset-4">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
