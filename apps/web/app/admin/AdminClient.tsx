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

  async function addSample() {
    await fetch(`${API}/___add?title=${encodeURIComponent('Boxy Tee — Jet Black')}&priceCents=3800&sku=TEE-BLK-001`);
    await load();
  }

  async function createProduct(e: React.FormEvent) {
    e.preventDefault();
    const body = {
      title,
      priceCents: Number(priceCents || 0),
      sku: sku || undefined,
      status: 'ACTIVE',
      inventory: 10,
    };
    await fetch(`${API}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    setTitle('');
    setPriceCents('');
    setSku('');
    await load();
  }

  useEffect(() => { load(); }, []);

  return (
    <main style={{ padding: 24, maxWidth: 720, margin: '0 auto' }}>
      <h1>Raspberry Admin</h1>
      <p style={{ marginTop: 8, color: '#666' }}>API: {API}</p>

      <section style={{ marginTop: 24, padding: 16, border: '1px solid #eee', borderRadius: 12 }}>
        <h2 style={{ marginTop: 0 }}>Create product</h2>
        <form onSubmit={createProduct} style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 160px 160px auto' }}>
          <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <input placeholder="Price (cents)" value={priceCents} onChange={e => setPriceCents(e.target.value)} />
          <input placeholder="SKU (optional)" value={sku} onChange={e => setSku(e.target.value)} />
          <button type="submit">Add</button>
        </form>
        <button onClick={addSample} style={{ marginTop: 8 }}>Add sample product</button>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2 style={{ marginTop: 0 }}>Products</h2>
        {loading ? (
          <div>Loading…</div>
        ) : products.length === 0 ? (
          <div>No products yet.</div>
        ) : (
          <table cellPadding={8} style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th align="left">Title</th>
                <th align="left">SKU</th>
                <th align="right">Price</th>
                <th align="right">Inventory</th>
                <th align="left">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={{ borderTop: '1px solid #eee' }}>
                  <td>{p.title}</td>
                  <td>{p.sku || '—'}</td>
                  <td align="right">${(p.priceCents / 100).toFixed(2)}</td>
                  <td align="right">{p.inventory}</td>
                  <td>{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
