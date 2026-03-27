# 🔌 The Plugski Smokeshop — Catalog

Customer-facing product catalog built with **Next.js** + **Supabase**, deployed on **Vercel**.

## Stack
- **Next.js 14** (App Router)
- **Supabase** — reads `products` and `stock_levels` tables
- **Vercel** — deployment
- **Telegram** — orders are sent via Telegram message

---

## Setup

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/plugski-catalog
cd plugski-catalog
npm install
```

### 2. Configure environment variables
Copy the example file:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in:
```
NEXT_PUBLIC_SUPABASE_URL=https://ebfcyhmbrxpeyajuzwrl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
NEXT_PUBLIC_TELEGRAM_USERNAME=the_plugski_shop
```

> **Where to find your Supabase Anon Key:**
> Supabase Dashboard → Settings → API → `anon public` key

### 3. Run locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Add these **Environment Variables** in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_TELEGRAM_USERNAME`
4. Click **Deploy** ✅

Vercel auto-deploys on every push to `main`.

---

## How it works

1. Products are managed from the Lovable Dashboard (by the owner)
2. This catalog reads from Supabase every 60 seconds
3. Customers browse, filter by category, and add to cart
4. When ready, they click **"Order via Telegram"** — opens a pre-filled message to `@the_plugski_shop`
5. Owner sees the order in Telegram and registers it in the Dashboard

---

## Supabase Tables Used

| Table | Fields read |
|-------|-------------|
| `products` | `id`, `name`, `brand`, `price`, `category`, `description`, `image_url` |
| `stock_levels` | `product_id`, `quantity` |

> Make sure Row Level Security (RLS) allows **public read** on these two tables.

---

## Adding Product Images

Currently using gradient placeholders. To add real images:
- Upload to Supabase Storage or any CDN
- Set the `image_url` field on the product in your Dashboard
- Images display automatically
