'use client'

import { useState } from 'react'
import { useCart } from '@/lib/cart-context'
import { Product } from '@/lib/supabase'

type ProductWithStock = Product & { stock: number }

// Brand-matched category colors (purple/gold/green from logo)
const categoryColors: Record<string, [string, string]> = {
  vapes:       ['#8b3fc8', '#5a1f99'],
  disposables: ['#a050d8', '#6a2fa0'],
  glass:       ['#4a8a3c', '#2d5e22'],
  wraps:       ['#c8a028', '#9a7a18'],
  accessories: ['#6a5acd', '#3d3080'],
  kratom:      ['#5a9a3c', '#2d6a1a'],
  cbd:         ['#8b3fc8', '#4a8a3c'],
  default:     ['#8b3fc8', '#5a1f99'],
}

// Unsplash search terms per category — returns real product-looking images
const categoryUnsplash: Record<string, string> = {
  vapes:       'vape device electronic cigarette',
  disposables: 'disposable vape pen',
  glass:       'glass pipe smoking',
  wraps:       'rolling papers tobacco',
  accessories: 'smoking accessories lighter',
  kratom:      'herbal supplement green powder',
  cbd:         'cbd hemp oil bottle',
  default:     'smoke shop product',
}

function getUnsplashUrl(product: ProductWithStock): string {
  // If product has its own image, use it
  if (product.image_url) return product.image_url

  // Build Unsplash source URL — free, no API key needed
  const category = (product.category || '').toLowerCase()
  const query = categoryUnsplash[category] || categoryUnsplash.default
  const searchTerm = encodeURIComponent(`${product.name} ${query}`)

  // Use a deterministic seed based on product id so same product always gets same image
  const seed = product.id ? product.id.slice(-8) : product.name.slice(0, 8)

  return `https://source.unsplash.com/400x300/?${searchTerm}&sig=${seed}`
}

function getCategoryColors(category: string): [string, string] {
  const key = (category || '').toLowerCase()
  return categoryColors[key] || categoryColors.default
}

export default function ProductCard({ product }: { product: ProductWithStock }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const colors = getCategoryColors(product.category)
  const outOfStock = product.stock === 0

  const handleAdd = () => {
    if (outOfStock) return
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const imgUrl = getUnsplashUrl(product)

  // Fallback gradient icons per category
  const icons: Record<string, string> = {
    vapes: '💨', disposables: '🔋', glass: '🔬',
    wraps: '📜', accessories: '🛠', kratom: '🌿', cbd: '💊', default: '🌿',
  }
  const icon = icons[(product.category || '').toLowerCase()] || icons.default

  return (
    <div
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        position: 'relative',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translateY(-4px)'
        el.style.borderColor = `${colors[0]}55`
        el.style.boxShadow = `0 20px 60px rgba(0,0,0,0.4), 0 0 30px ${colors[0]}18`
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translateY(0)'
        el.style.borderColor = 'var(--border)'
        el.style.boxShadow = 'none'
      }}
    >
      {/* Image */}
      <div style={{ height: '200px', overflow: 'hidden', position: 'relative', background: 'var(--bg-2)' }}>
        {!imgError ? (
          <img
            src={imgUrl}
            alt={product.name}
            onError={() => setImgError(true)}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transition: 'transform 0.4s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)' }}
          />
        ) : (
          // Fallback gradient placeholder
          <div style={{
            width: '100%', height: '100%',
            background: `linear-gradient(135deg, ${colors[0]}22, ${colors[1]}44)`,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}>
            <span style={{ fontSize: '40px' }}>{icon}</span>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: colors[0], letterSpacing: '1px', opacity: 0.7 }}>
              {(product.category || 'product').toUpperCase()}
            </span>
          </div>
        )}

        {/* Gradient overlay on image for text readability */}
        {!imgError && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px',
            background: 'linear-gradient(transparent, rgba(0,0,0,0.5))',
            pointerEvents: 'none',
          }} />
        )}

        {/* Out of stock */}
        {outOfStock && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(8,10,15,0.75)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '2px',
              color: '#ff4d6d', border: '1px solid #ff4d6d', padding: '4px 10px', borderRadius: '2px',
            }}>SOLD OUT</span>
          </div>
        )}

        {/* Category tag */}
        {product.category && (
          <div style={{
            position: 'absolute', top: '10px', left: '10px',
            background: `${colors[0]}33`,
            border: `1px solid ${colors[0]}55`,
            borderRadius: '20px', padding: '3px 10px',
            fontSize: '10px', fontFamily: 'var(--font-mono)',
            color: colors[0], letterSpacing: '1px', backdropFilter: 'blur(8px)',
          }}>
            {product.category.toUpperCase()}
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {product.brand && (
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '1px' }}>
            {product.brand.toUpperCase()}
          </span>
        )}

        <h3 style={{ fontSize: '15px', fontWeight: '500', color: 'var(--text)', lineHeight: '1.3', flex: 1 }}>
          {product.name}
        </h3>

        {product.description && (
          <p style={{
            fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5',
            display: '-webkit-box', WebkitLineClamp: '2',
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {product.description}
          </p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: '700',
            background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            ${product.price?.toFixed(2)}
          </span>

          {product.stock > 0 && product.stock <= 5 && (
            <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: '#c8a028', letterSpacing: '1px' }}>
              {product.stock} LEFT
            </span>
          )}
        </div>

        <button
          onClick={handleAdd}
          disabled={outOfStock}
          style={{
            width: '100%', padding: '11px', borderRadius: '6px',
            border: outOfStock ? '1px solid var(--border)' : `1px solid ${colors[0]}44`,
            background: added
              ? 'linear-gradient(135deg, #4a8a3c, #2d5e22)'
              : outOfStock ? 'var(--bg-3)'
              : `linear-gradient(135deg, ${colors[0]}22, ${colors[1]}33)`,
            color: outOfStock ? 'var(--text-dim)' : added ? '#fff' : colors[0],
            fontSize: '12px', fontFamily: 'var(--font-mono)',
            letterSpacing: '1px', fontWeight: '600',
            transition: 'all 0.2s',
            cursor: outOfStock ? 'not-allowed' : 'pointer',
          }}
        >
          {added ? '✓ ADDED' : outOfStock ? 'SOLD OUT' : '+ ADD TO CART'}
        </button>
      </div>
    </div>
  )
}
