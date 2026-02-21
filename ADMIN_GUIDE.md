# 🦅 Admin Guidance · Obsidian Operations
**Access:** `https://dinacosmetic.store/admin`

## 🎭 Admin Role Activation
1. Sign up on the storefront with your email.
2. Go to **Supabase Dashboard > Table Editor > profiles**.
3. Find your user ID and change `role` from `user` to `admin`.
4. Refresh the admin portal.

## 📦 Merchandise Management
- **Dashboard:** Track total luxury sales, recent volume, and low stock alerts.
- **Stock:** Inventory is **Atomic**. If you sell 1 unit, the system locks the database row to prevent overselling.
- **Pricing:** Validated server-side during checkout.

## 🎨 Visual Curation (Frontend)
- Navigate to **Admin > Customization**.
- Change the **Hero Masterpiece** title and subtitle.
- Updates apply instantly to the homepage via Next.js server actions.

## 📜 Order Ledger
- View all paid sessions synced from Stripe.
- Click a Reference Number to enter the fulfillment workflow.

## ⚠️ Security Protocols
- Never share your `SUPABASE_SERVICE_ROLE_KEY`. It allows full DB bypass.
- The `/admin` route is protected by both Next.js middleware and Supabase RLS policies (Double-lock).
