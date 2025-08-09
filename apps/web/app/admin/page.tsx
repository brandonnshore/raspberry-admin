]'use client';

import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function AdminPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [priceCents, setPriceCents] = useState('');
  const [sku, setSku] = useState('');

  useEffect(() => {
    fetch(`${API}/products`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

  const addProduct = () => {
    if (!title || !priceCents) {
      alert('Please fill in title and price');
      return;
    }
    fetch(
      `${API}/___add?title=${encodeURIComponent(title)}&priceCents=${priceCents}&sku=${encodeURIComponent(
        sku
      )}`
    )
      .then(res => res.json())
      .then(data => {
        alert('Product added!');
        setProducts([...products, data.created]);
        setTitle('');
        setPriceCents('');
        setSku('');
      })
      .catch(err => console.error('Error adding product:', err));
  };

  return (
    <main style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Raspberry Admin</h1>

      <section style={{ marginBottom: 32 }}>
        <h2>Add a Product</h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{ padding: 8 }}
          />
          <input
            placeholder="Price (cents)"
            value={priceCents}
            onChange={e => setPriceCents(e.target.value)}
            style={{ padding: 8 }}
          />
          <input
            placeholder="SKU"
            value={sku}
            onChange={e => setSku(e.target.value)}
            style={{ padding: 8 }}
          />
          <button onClick={addProduct} style={{ padding: '8px 16px', cursor: 'pointer' }}>
            Add
          </button>
        </div>
      </section>

      <section>
        <h2>Products</h2>
        {loading ? (
          <p>Loading...</p>
        ) : products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <table border={1} cellPadding={8}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Price (USD)</th>
                <th>SKU</th>
                <th>Status</th>
                <th>Inventory</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>{p.title}</td>
                  <td>${(p.priceCents / 100).toFixed(2)}</td>
                  <td>{p.sku}</td>
                  <td>{p.status}</td>
                  <td>{p.inventory}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
