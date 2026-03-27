'use client'

import { useState } from 'react'
import ProductCard from './ProductCard'
import { Product } from '@/lib/supabase'

type ProductWithStock = Product & { stock: number }

export default function CatalogSection({
  products,
  categories,
}: {
  products: ProductWithStock[]
  categories: string[]
}) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = products.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory
    const matchSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand || '').toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <section id="catalog" style={{ padding: '80px 0 120px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>

        {/* Section header */}
        <div style={{ marginBottom: '48px' }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '3px',
            color: 'var(--accent)',
          }}>
            — CATALOG
          </span>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(40px, 6vw, 72px)',
            letterSpacing: '2px',
            color: 'var(--text)',
            lineHeight: '1',
            marginTop: '8px',
          }}>
            ALL PRODUCTS
          </h2>
        </div>

        {/* Filter bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '32px',
          alignItems: 'center',
        }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '320px' }}>
            <svg
              width="14" height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            >
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 36px',
                background: 'var(--bg-2)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                color: 'var(--text)',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>

          {/* Category chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: activeCategory === cat
                    ? '1px solid var(--accent)'
                    : '1px solid var(--border)',
                  background: activeCategory === cat
                    ? 'rgba(160,100,255,0.15)'
                    : 'transparent',
                  color: activeCategory === cat ? 'var(--accent)' : 'var(--text-muted)',
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '1px',
                  transition: 'all 0.2s',
                }}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--text-muted)',
          letterSpacing: '1px',
          marginBottom: '24px',
        }}>
          {filtered.length} {filtered.length === 1 ? 'PRODUCT' : 'PRODUCTS'} FOUND
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '20px',
          }}>
            {filtered.map((product, i) => (
              <div
                key={product.id}
                style={{
                  animation: `fadeUp 0.4s ${i * 0.05}s ease both`,
                }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '80px 24px',
            color: 'var(--text-muted)',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔌</div>
            <p style={{ fontFamily: 'var(--font-mono)', letterSpacing: '2px', fontSize: '13px' }}>
              NO PRODUCTS FOUND
            </p>
            <p style={{ fontSize: '13px', marginTop: '8px', color: 'var(--text-dim)' }}>
              Try a different search or category
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
