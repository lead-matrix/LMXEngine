# 🚀 Deployment Guide

## Quick Deployment to Vercel

### 1. Prerequisites
- GitHub repository
- Vercel account
- All environment variables ready

### 2. Deploy

```bash
# Push to GitHub
git push origin main

# Vercel will auto-deploy if connected
# Or manually: vercel --prod
```

### 3. Environment Variables

Add these to Vercel Dashboard → Settings → Environment Variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Email & Shipping
RESEND_API_KEY=
SHIPPO_API_KEY=

# Site URL
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 4. Configure Stripe Webhook

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click **Add endpoint**
3. URL: `https://your-domain.com/api/stripe-webhook`
4. Select event: `checkout.session.completed`
5. Copy webhook secret to Vercel environment variables

### 5. Test Production

- [ ] Test checkout flow
- [ ] Verify webhook receives events
- [ ] Check admin portal access
- [ ] Test image uploads
- [ ] Verify email notifications

## Troubleshooting

### Webhook Not Working
1. Verify webhook URL is correct
2. Check `STRIPE_WEBHOOK_SECRET` matches Stripe Dashboard
3. Monitor Vercel function logs

### Admin Access Denied
1. Verify user has `role = 'admin'` in profiles table
2. Check browser console for errors
3. Try logging out and back in

### Images Not Uploading
1. Verify `product-images` bucket exists
2. Check bucket is set to Public
3. Verify RLS policies applied

## Monitoring

- **Vercel Logs**: `vercel logs --follow`
- **Stripe Events**: Dashboard → Webhooks → Events
- **Supabase Logs**: Dashboard → Logs

---

For detailed setup, see [README.md](README.md)
