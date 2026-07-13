'use client'

import { useState } from 'react'
import { useCart } from '@/lib/cart-context'
import { Product } from '@/lib/supabase'

type ProductWithStock = Product & { stock: number }

function productInitials(product: ProductWithStock) {
  const source = product.brand || product.name || 'PL'
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase()
}

function ProductImage({ product }: { product: ProductWithStock }) {
  const [imgError, setImgError] = useState(false)

  if (product.image_url && !imgError) {
    return (
      <img
        src={product.image_url}
        alt={product.name}
        onError={() => setImgError(true)}
      />
    )
  }

  return (
    <div className="product-card__fallback">
      <span>{productInitials(product)}</span>
      <small>{product.category || 'Drop'}</small>
    </div>
  )
}

export default function ProductCard({ product }: { product: ProductWithStock }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const outOfStock = product.stock === 0

  const handleAdd = () => {
    if (outOfStock) return
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  return (
    <article className={`product-card ${outOfStock ? 'product-card--sold-out' : ''}`}>
      <div className="product-card__art">
        {product.category && <span className="product-card__category">{product.category}</span>}
        {outOfStock ? (
          <span className="product-card__tag product-card__tag--sold">Sold out</span>
        ) : product.stock <= 5 ? (
          <span className="product-card__tag">Few left</span>
        ) : null}
        <ProductImage product={product} />
      </div>

      <div className="product-card__info">
        {product.brand && <p>{product.brand}</p>}
        <h3>{product.name}</h3>
        {product.description && <span>{product.description}</span>}

        <div className="product-card__buy">
          <strong>${product.price?.toFixed(2)}</strong>
          <button type="button" onClick={handleAdd} disabled={outOfStock}>
            {added ? 'Added' : outOfStock ? 'Sold out' : 'Add'}
          </button>
        </div>
      </div>
    </article>
  )
}
