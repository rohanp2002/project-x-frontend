'use client'
import { useState, useEffect, FormEvent } from 'react'

type Stock = { symbol: string; price: number }
type WatchItem = { id: number; symbol: string; note?: string }

export default function HomePage() {
  const [symbol, setSymbol] = useState('AAPL')
  const [price, setPrice] = useState<number | null>(null)
  const [note, setNote] = useState('')
  const [watchlist, setWatchlist] = useState<WatchItem[]>([])

  const API = 'http://localhost:8000'

  async function fetchPrice(e?: FormEvent) {
    e?.preventDefault()
    setPrice(null)
    try {
      const res = await fetch(`${API}/stocks/${symbol}`)
      if (!res.ok) throw new Error(await res.text())
      const data: Stock = await res.json()
      setPrice(data.price)
    } catch (err) {
      console.error(err)
      alert('Error fetching price')
    }
  }

  async function loadWatchlist() {
    const res = await fetch(`${API}/watchlist/`)
    if (res.ok) setWatchlist(await res.json())
  }

  async function addToWatchlist() {
    const res = await fetch(`${API}/watchlist/`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ symbol, note }),
    })
    if (res.ok) {
      setNote('')
      loadWatchlist()
    } else {
      alert('Failed to add')
    }
  }

  async function deleteItem(id: number) {
    await fetch(`${API}/watchlist/${id}`, { method: 'DELETE' })
    loadWatchlist()
  }

  useEffect(() => { loadWatchlist() }, [])

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Project X Dashboard</h1>

      <form onSubmit={fetchPrice} style={{ marginBottom: '1.5rem' }}>
        <input
          value={symbol}
          onChange={e => setSymbol(e.target.value.toUpperCase())}
          style={{ fontSize: '1rem', padding: '0.5rem' }}
        />
        <button type="submit" style={{ marginLeft: '0.5rem' }}>Get Price</button>
      </form>

      {price !== null && (
        <div style={{ marginBottom: '1rem' }}>
          <strong>Price:</strong> ${price.toFixed(2)}
        </div>
      )}

      <div style={{ marginBottom: '2rem' }}>
        <input
          placeholder="Note (optional)"
          value={note}
          onChange={e => setNote(e.target.value)}
          style={{ marginRight: '0.5rem', padding: '0.5rem' }}
        />
        <button onClick={addToWatchlist}>Add to Watchlist</button>
      </div>

      <section>
        <h2>My Watchlist</h2>
        {watchlist.length === 0 ? (
          <p>(No items yet)</p>
        ) : (
          <ul>
            {watchlist.map(item => (
              <li key={item.id} style={{ marginBottom: '0.5rem' }}>
                <strong>{item.symbol}</strong>
                {item.note && <em> — {item.note}</em>}
                <button
                  onClick={() => deleteItem(item.id)}
                  style={{ marginLeft: '1rem' }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
