import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Product = {
  id: string
  name: string
  brand: string
  price: number
  category: string
  description?: string
  image_url?: string
  created_at: string
}

export type StockLevel = {
  product_id: string
  quantity: number
}
