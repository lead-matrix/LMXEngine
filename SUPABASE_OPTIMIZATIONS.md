# Supabase Optimizations & Fixes

This guide consolidates all recent security and performance optimizations into a single execution plan.

## 🚀 Execution Instructions

Run the following SQL script in your **Supabase SQL Editor**:

1.  Open **Supabase Dashboard** > **SQL Editor**
2.  Open or upload `supabase-optimizations.sql`
3.  Click **Run**

## 🛡️ What This Script Fixes

### 1. Security Warnings
*   **Function Search Path Mutable**: Fixes `site_customization_set_updated_fields` and others to be secure.
*   **RLS Enabled No Policy**: Adds policies to `public.admins` table.

### 2. Performance Warnings
*   **Multiple Permissive Policies**: Consolidates overlapping policies into distinct `SELECT`, `INSERT`, `UPDATE`, `DELETE` policies for:
    *   `categories`
    *   `frontend_content`
    *   `media_library`
    *   `navigation_menus`
    *   `pages`
    *   `products`
    *   `theme_settings`
*   **Auth RLS Initialization Plan**: Wraps all `auth.uid()` calls in `(SELECT auth.uid())` to prevent per-row re-evaluation.
*   **Unindexed Foreign Keys**: Adds index to `media_library(uploaded_by)`.

## ⚠️ Additional Manual Steps

### Leaked Password Protection
This cannot be enabled via SQL. You must do it manually:
1.  Go to **Authentication** > **Policies**
2.  Enable **"Leaked Password Protection"** under Password Strength.

---

*This file replaces the previous `SECURITY_FIXES_GUIDE.md` and `supabase-performance-fixes.sql`.*
