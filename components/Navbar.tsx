'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/lib/cart-context'

export default function Navbar() {
  const { totalItems, items } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [bump, setBump] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (totalItems > 0) {
      setBump(true)
      setTimeout(() => setBump(false), 300)
    }
  }, [totalItems])

  const toggleCart = () => {
    const event = new CustomEvent('toggle-cart')
    window.dispatchEvent(event)
  }

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      padding: '0 24px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: scrolled ? 'rgba(8,10,15,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      transition: 'all 0.3s ease',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src="/logo-transparent.png"
          alt="The Plugski"
          style={{
            height: '48px',
            width: 'auto',
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 12px rgba(160,100,255,0.4))',
          }}
          onError={(e) => {
            // fallback to text if logo not found
            const parent = (e.currentTarget as HTMLImageElement).parentElement!
            e.currentTarget.style.display = 'none'
            parent.innerHTML = `<span style="font-family:var(--font-display);font-size:22px;letter-spacing:2px;background:linear-gradient(90deg,#fff,#a064ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent">THE PLUGSKI</span>`
          }}
        />
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <a
          href="https://t.me/the_plugski_shop"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            borderRadius: '20px',
            border: '1px solid rgba(0,229,192,0.3)',
            color: 'var(--accent-2)',
            fontSize: '13px',
            fontWeight: '500',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(0,229,192,0.1)'
            ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-2)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'transparent'
            ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,229,192,0.3)'
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.932z"/>
          </svg>
          Contact
        </a>

        {/* Cart button */}
        <button
          onClick={toggleCart}
          style={{
            position: 'relative',
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: totalItems > 0 ? 'var(--accent)' : 'var(--bg-3)',
            border: '1px solid var(--border)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            transform: bump ? 'scale(1.2)' : 'scale(1)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61H19a2 2 0 001.99-1.79l1-9.21H6"/>
          </svg>
          {totalItems > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              minWidth: '18px',
              height: '18px',
              borderRadius: '9px',
              background: 'var(--accent-3)',
              color: '#fff',
              fontSize: '10px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-mono)',
            }}>{totalItems}</span>
          )}
        </button>
      </div>
    </nav>
  )
}
