'use client'

import { useState } from 'react'
import { useCart } from '@/lib/cart-context'
import { Product } from '@/lib/supabase'

type ProductWithStock = Product & { stock: number }

// Color mapping for category gradients
const categoryColors: Record<string, string[]> = {
  vapes:       ['#a064ff', '#5033cc'],
  disposables: ['#ff4d6d', '#cc1a3a'],
  glass:       ['#00e5c0', '#00997f'],
  wraps:       ['#ffb347', '#cc7700'],
  accessories: ['#64b5f6', '#1565c0'],
  kratom:      ['#81c784', '#2e7d32'],
  cbd:         ['#ce93d8', '#7b1fa2'],
  default:     ['#a064ff', '#3d1f7a'],
}

function getCategoryColors(category: string) {
  const key = (category || '').toLowerCase()
  return categoryColors[key] || categoryColors.default
}

function ProductImage({ product }: { product: ProductWithStock }) {
  const [imgError, setImgError] = useState(false)
  const colors = getCategoryColors(product.category)

  if (product.image_url && !imgError) {
    return (
      <img
        src={product.image_url}
        alt={product.name}
        onError={() => setImgError(true)}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    )
  }

  // Placeholder gradient with icon
  const icons: Record<string, string> = {
    vapes: '💨', disposables: '🔋', glass: '🔬',
    wraps: '📜', accessories: '🛠', kratom: '🌿',
    cbd: '💊', default: '🔌',
  }
  const icon = icons[(product.category || '').toLowerCase()] || icons.default

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: `linear-gradient(135deg, ${colors[0]}22, ${colors[1]}44)`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    }}>
      <span style={{ fontSize: '40px' }}>{icon}</span>
      <span style={{
        fontSize: '11px',
        fontFamily: 'var(--font-mono)',
        color: colors[0],
        letterSpacing: '1px',
        opacity: 0.7,
      }}>
        {(product.category || 'product').toUpperCase()}
      </span>
    </div>
  )
}

export default function ProductCard({ product }: { product: ProductWithStock }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const colors = getCategoryColors(product.category)
  const outOfStock = product.stock === 0

  const handleAdd = () => {
    if (outOfStock) return
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div style={{
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
      el.style.borderColor = `${colors[0]}44`
      el.style.boxShadow = `0 20px 60px rgba(0,0,0,0.4), 0 0 30px ${colors[0]}15`
    }}
    onMouseLeave={e => {
      const el = e.currentTarget as HTMLElement
      el.style.transform = 'translateY(0)'
      el.style.borderColor = 'var(--border)'
      el.style.boxShadow = 'none'
    }}>
      {/* Image area */}
      <div style={{
        height: '200px',
        overflow: 'hidden',
        position: 'relative',
        background: 'var(--bg-2)',
      }}>
        <ProductImage product={product} />

        {/* Out of stock overlay */}
        {outOfStock && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(8,10,15,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '2px',
              color: 'var(--accent-3)',
              border: '1px solid var(--accent-3)',
              padding: '4px 10px',
              borderRadius: '2px',
            }}>SOLD OUT</span>
          </div>
        )}

        {/* Category tag */}
        {product.category && (
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            background: `${colors[0]}22`,
            border: `1px solid ${colors[0]}44`,
            borderRadius: '20px',
            padding: '3px 10px',
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            color: colors[0],
            letterSpacing: '1px',
            backdropFilter: 'blur(8px)',
          }}>
            {product.category.toUpperCase()}
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {product.brand && (
          <span style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
            letterSpacing: '1px',
          }}>
            {product.brand.toUpperCase()}
          </span>
        )}

        <h3 style={{
          fontSize: '15px',
          fontWeight: '500',
          color: 'var(--text)',
          lineHeight: '1.3',
          flex: 1,
        }}>
          {product.name}
        </h3>

        {product.description && (
          <p style={{
            fontSize: '12px',
            color: 'var(--text-muted)',
            lineHeight: '1.5',
            display: '-webkit-box',
            WebkitLineClamp: '2',
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {product.description}
          </p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '20px',
            fontWeight: '700',
            background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            ${product.price?.toFixed(2)}
          </span>

          {product.stock > 0 && product.stock <= 5 && (
            <span style={{
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              color: '#ffb347',
              letterSpacing: '1px',
            }}>
              {product.stock} LEFT
            </span>
          )}
        </div>

        <button
          onClick={handleAdd}
          disabled={outOfStock}
          style={{
            width: '100%',
            padding: '11px',
            borderRadius: '6px',
            border: outOfStock ? '1px solid var(--border)' : `1px solid ${colors[0]}44`,
            background: added
              ? `linear-gradient(135deg, var(--accent-2), #00997f)`
              : outOfStock
                ? 'var(--bg-3)'
                : `linear-gradient(135deg, ${colors[0]}22, ${colors[1]}33)`,
            color: outOfStock ? 'var(--text-dim)' : added ? '#fff' : colors[0],
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '1px',
            fontWeight: '600',
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
