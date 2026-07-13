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

  const filtered = products.filter(product => {
    const normalizedSearch = search.toLowerCase()
    const matchCat = activeCategory === 'All' || product.category === activeCategory
    const matchSearch =
      !search ||
      product.name.toLowerCase().includes(normalizedSearch) ||
      (product.brand || '').toLowerCase().includes(normalizedSearch) ||
      (product.category || '').toLowerCase().includes(normalizedSearch)

    return matchCat && matchSearch
  })

  return (
    <section id="catalog" className="catalog">
      <div className="category-marquee" aria-label="Product category highlights">
        <span>Disposables</span>
        <span>Carts</span>
        <span>Flower</span>
        <span>Edibles</span>
        <span>Accessories</span>
        <span>Fresh drops</span>
      </div>

      <div className="catalog__top">
        <div>
          <p className="eyebrow">Live menu</p>
          <h2>Pick your drop</h2>
        </div>

        <label className="catalog-search">
          <span>Search</span>
          <input
            type="search"
            placeholder="Brand, product, category..."
            value={search}
            onChange={event => setSearch(event.target.value)}
          />
        </label>
      </div>

      <div className="category-tabs" aria-label="Product categories">
        {categories.map(category => (
          <button
            key={category}
            className={activeCategory === category ? 'active' : ''}
            type="button"
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <p className="catalog__count">
        {filtered.length} {filtered.length === 1 ? 'product' : 'products'} found
      </p>

      {filtered.length > 0 ? (
        <div className="product-grid">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <strong>No products found</strong>
          <span>Try another search or category.</span>
        </div>
      )}
    </section>
  )
}
