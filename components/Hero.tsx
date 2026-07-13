'use client'

export default function Hero() {
  const scrollToCatalog = () => {
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })
  }

  const openCart = () => {
    window.dispatchEvent(new CustomEvent('toggle-cart'))
  }

  return (
    <section className="hero" id="top">
      <div className="hero__logo-card">
        <img src="/plugski-logo.png" alt="The Plugski" />
        <span className="age-stamp">21+ only</span>
      </div>

      <div className="hero__menu-card">
        <p className="eyebrow">956 menu board</p>
        <h1>Fresh smoke shop drops, posted clean.</h1>
        <p className="hero__text">
          Browse the live catalog, add what you want, and send the cart for confirmation.
        </p>

        <div className="hero__actions">
          <button className="button button--purple" type="button" onClick={scrollToCatalog}>
            Open catalog
          </button>
          <button className="button button--cream" type="button" onClick={openCart}>
            View cart
          </button>
        </div>

        <div className="quick-board" aria-label="Catalog highlights">
          <button type="button" onClick={scrollToCatalog}>
            <span>Hot</span>
            <strong>Disposables</strong>
            <small>Browse fresh vapes</small>
          </button>
          <button type="button" onClick={scrollToCatalog}>
            <span>New</span>
            <strong>Carts</strong>
            <small>Live resin and more</small>
          </button>
          <button type="button" onClick={scrollToCatalog}>
            <span>Deals</span>
            <strong>Accessories</strong>
            <small>Gear and essentials</small>
          </button>
        </div>
      </div>
    </section>
  )
}
