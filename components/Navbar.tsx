'use client'

import { useEffect, useState } from 'react'
import { useCart } from '@/lib/cart-context'

export default function Navbar() {
  const { totalItems } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [bump, setBump] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (totalItems > 0) {
      setBump(true)
      const timeout = setTimeout(() => setBump(false), 260)
      return () => clearTimeout(timeout)
    }
  }, [totalItems])

  const toggleCart = () => {
    window.dispatchEvent(new CustomEvent('toggle-cart'))
  }

  return (
    <nav className={`site-nav ${scrolled ? 'site-nav--scrolled' : ''}`}>
      <a className="site-nav__logo" href="#top" aria-label="The Plugski home">
        <img src="/plugski-logo.png" alt="The Plugski" />
      </a>

      <div className="site-nav__links" aria-label="Main navigation">
        <a href="#top">Menu</a>
        <a href="#catalog">Catalog</a>
        <a href="https://linktr.ee/956vrtshopski" target="_blank" rel="noopener noreferrer">
          Contact
        </a>
      </div>

      <button
        className={`site-nav__cart ${bump ? 'site-nav__cart--bump' : ''}`}
        type="button"
        onClick={toggleCart}
      >
        Cart
        <span>{totalItems}</span>
      </button>
    </nav>
  )
}
