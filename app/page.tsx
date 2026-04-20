import { supabase, Product, StockLevel } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import CatalogSection from '@/components/CatalogSection'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'

async function getProducts() {
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: stock } = await supabase
    .from('stock_levels')
    .select('product_id, quantity')

  const stockMap: Record<string, number> = {}
  ;(stock || []).forEach((s: StockLevel) => {
    stockMap[s.product_id] = s.quantity
  })

  return (products || []).map((p: any) => ({
    ...p,
    price: p.sale_price || p.price || 0,  // Map sale_price to price
    stock: stockMap[p.id] ?? 0,
  }))
}

export const revalidate = 60 // revalidate every 60 seconds

export default async function HomePage() {
  const products = await getProducts()
  const categories = ['All', ...Array.from(new Set(products.map((p: any) => p.category).filter(Boolean)))]

  return (
    <>
      <Navbar />
      <CartDrawer />
      <main>
        <Hero />
        <CatalogSection products={products} categories={categories} />
      </main>
      <Footer />
    </>
  )
}
