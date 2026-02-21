# 🚀 DINA COSMETIC · Launch Preparation Guide
**Domain:** [dinacosmetic.store](https://dinacosmetic.store)

## 1. Environment Configuration (Vercel)

Add these to your **Vercel Project Settings > Environment Variables**.

### 🔐 System Keys
| Variable | Value Source | Environment |
|:---|:---|:---|
| `NEXT_PUBLIC_SITE_URL` | `https://dinacosmetic.store` | Production |
| `NEXT_PUBLIC_SITE_URL` | `https://your-preview-url.vercel.app` | Preview |
| `NODE_ENV` | `production` | Production |

### 🛠️ Supabase (Backend)
| Variable | Value Source |
|:---|:---|
| `NEXT_PUBLIC_SUPABASE_URL` | `Settings > API > Project URL` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `Settings > API > anon public` |
| `SUPABASE_SERVICE_ROLE_KEY` | `Settings > API > service_role` (Keep Secret) |

### 💳 Stripe (Payments)
| Variable | Value Source |
|:---|:---|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `Dashboard > Developers > API Keys` |
| `STRIPE_SECRET_KEY` | `Dashboard > Developers > API Keys` (Keep Secret) |
| `STRIPE_WEBHOOK_SECRET` | `Dashboard > Developers > Webhooks` (After Creating) |

---

## 2. Production Webhook Setup
1. Go to **Stripe Dashboard > Developers > Webhooks**.
2. Click **Add Endpoint**.
3. **URL:** `https://dinacosmetic.store/api/stripe/webhook`
4. **Events:** Select `checkout.session.completed`.
5. Copy the **Signing Secret** (`whsec_...`) and add it to Vercel as `STRIPE_WEBHOOK_SECRET`.

---

## 3. Database URL (Postgres Connection)
In your Supabase dashboard (**Settings > Database**), find the **Connection String**.
- **Mode:** Transaction (Port 6543)
- **URL Pattern:** `postgresql://postgres:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true`

*This is used for migrations or long-running scripts if needed.*

---

## 4. Final Verification Checklist
- [ ] **Auth Redirects:** In Supabase Auth > URL Configuration, set `https://dinacosmetic.store/**` as allowed.
- [ ] **Stock Levels:** Set initial stock in `/admin/products`.
- [ ] **Deployment:** Run `git push origin main` and monitor Vercel dashboard.
