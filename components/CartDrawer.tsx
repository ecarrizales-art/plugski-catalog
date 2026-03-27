'use client'

import { useEffect, useState } from 'react'
import { useCart } from '@/lib/cart-context'

const TELEGRAM = process.env.NEXT_PUBLIC_TELEGRAM_USERNAME || 'the_plugski_shop'

export default function CartDrawer() {
  const { items, removeItem, updateQty, clearCart, totalItems, totalPrice } = useCart()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = () => setOpen(prev => !prev)
    window.addEventListener('toggle-cart', handler)
    return () => window.removeEventListener('toggle-cart', handler)
  }, [])

  const handleOrderTelegram = () => {
    if (items.length === 0) return

    const lines = items.map(i =>
      `• ${i.name}${i.brand ? ` (${i.brand})` : ''} x${i.quantity} — $${(i.price * i.quantity).toFixed(2)}`
    )

    const message = [
      '🛒 New Order from Plugski Catalog',
      '',
      ...lines,
      '',
      `━━━━━━━━━━━━━━━`,
      `TOTAL: $${totalPrice.toFixed(2)}`,
    ].join('\n')

    const url = `https://t.me/${TELEGRAM}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 200,
          }}
        />
      )}

      {/* Drawer */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        maxWidth: '400px',
        background: 'var(--bg-2)',
        borderLeft: '1px solid var(--border)',
        zIndex: 201,
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '28px',
              letterSpacing: '2px',
            }}>YOUR CART</h2>
            <span style={{
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
            }}>
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            style={{
              width: '36px', height: '36px',
              borderRadius: '50%',
              background: 'var(--bg-3)',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              fontSize: '18px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >×</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {items.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: '12px',
              color: 'var(--text-muted)',
            }}>
              <span style={{ fontSize: '48px' }}>🛒</span>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '2px' }}>
                CART IS EMPTY
              </p>
              <p style={{ fontSize: '13px', color: 'var(--text-dim)', textAlign: 'center' }}>
                Browse the catalog and add products
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {items.map(item => (
                <div key={item.id} style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '14px',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                }}>
                  {/* Thumbnail placeholder */}
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '8px',
                    background: 'var(--bg-3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    flexShrink: 0,
                  }}>
                    {item.image_url
                      ? <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                      : '📦'}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    {item.brand && (
                      <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '2px' }}>
                        {item.brand.toUpperCase()}
                      </div>
                    )}
                    <div style={{ fontSize: '13px', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.name}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '14px',
                      color: 'var(--accent)',
                      marginTop: '4px',
                    }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>

                  {/* Qty controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      onClick={() => updateQty(item.id, item.quantity - 1)}
                      style={{
                        width: '26px', height: '26px',
                        borderRadius: '50%',
                        background: 'var(--bg-3)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-muted)',
                        fontSize: '14px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >−</button>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                      minWidth: '20px',
                      textAlign: 'center',
                    }}>{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                      style={{
                        width: '26px', height: '26px',
                        borderRadius: '50%',
                        background: 'var(--bg-3)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-muted)',
                        fontSize: '14px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >+</button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    style={{
                      width: '28px', height: '28px',
                      borderRadius: '50%',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-dim)',
                      fontSize: '16px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--accent-3)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-dim)' }}
                  >×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{
            padding: '20px 24px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '1px' }}>
                TOTAL
              </span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '24px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleOrderTelegram}
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #229ED9, #1a7fac)',
                border: 'none',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '600',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '1px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'all 0.2s',
                boxShadow: '0 4px 20px rgba(34,158,217,0.3)',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(34,158,217,0.5)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(34,158,217,0.3)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.932z"/>
              </svg>
              ORDER VIA TELEGRAM
            </button>

            <button
              onClick={clearCart}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                background: 'transparent',
                border: '1px solid var(--border)',
                color: 'var(--text-dim)',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '1px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-3)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent-3)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-dim)' }}
            >
              CLEAR CART
            </button>
          </div>
        )}
      </div>
    </>
  )
}
