# DINA COSMETIC | The Obsidian Palace

An ultra-luxury, production-ready e-commerce platform built with Next.js 15, Supabase, and Stripe.

## Tech Stack
- **Frontend**: Next.js 15 (App Router), Tailwind CSS v4, Lucide Icons
- **Backend**: Supabase (Auth, DB, RLS)
- **Payments**: Stripe Checkout & Webhooks
- **Analytics**: Vercel Analytics

## Design System: "The Obsidian Palace"
- **Background**: Deep Black (#000000)
- **Accent**: Liquid Gold (#D4AF37)
- **Typography**: Playfair Display (Serif), Inter (Sans)

## Launch Readiness Checklist

### 1. Supabase Setup
1. Create a new Supabase project.
2. Run the contents of `supabase-migration.sql` in the SQL Editor.
3. Enable Email/Password Auth in the Authentication settings.
4. Set up an admin user by updating the `role` column in the `profiles` table to `'admin'` for your user ID.

### 2. Stripe Setup
1. Create a Stripe account.
2. Get your Secret Key and Publishable Key.
3. Set up a Webhook endpoint pointing to `https://your-domain.com/api/webhooks/stripe`.
4. Listen for `checkout.session.completed` and get the Webhook Secret (`whsec_...`).

### 3. Environment Variables
Copy `.env.example` to `.env.local` and fill in the values:
```bash
cp .env.example .env.local
```

### 4. Local Development
```bash
npm install
npm run dev
```

### 5. Deployment
Deploy to Vercel and ensure all environment variables are added to the Vercel project settings.

## Features
- **Unified Storefront & Admin Portal**: Minimalist luxury store and a "human-proof" admin dashboard.
- **Secure Mutations**: Server Actions for all database writes.
- **RLS Protection**: Data is secured at the database level.
- **Stripe Integration**: Automated order status updates via webhooks.
- **Inventory Management**: Stock level tracking and low-stock alerts on the dashboard.
- **SEO Optimized**: Dynamic metadata for every page.

## Project Structure
- `/app`: Main application routes (Storefront & `/admin`).
- `/components`: Shared UI components.
- `/utils/supabase`: Supabase client factories (server, client, admin, middleware).
- `/lib/actions`: Server actions for admin & user mutations.
- `/context`: Global state (Cart, etc.).
- `supabase-migration.sql`: Main database schema.
- `middleware.ts`: Auth & Admin route protection.
