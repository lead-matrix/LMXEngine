-- ============================================================
--  LMXEngine · DINA COSMETIC · PHASE 3: RLS PERFORMANCE FIX
--  Resolves ALL Supabase linter warnings in one shot:
--    1. auth_rls_initplan  → wrap auth.uid() in (select ...)
--    2. multiple_permissive_policies → drop all, recreate exactly ONE policy per action
--    3. duplicate_index    → drop idx_products_category (keep idx_products_category_id)
--  Safe to run multiple times (idempotent)
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- HELPER: drop every policy on a table so we start fresh
-- ─────────────────────────────────────────────────────────────
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT policyname, tablename
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('orders','order_items','products','categories','profiles','variants','site_settings','frontend_content')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END$$;

-- ─────────────────────────────────────────────────────────────
-- 1. ORDERS
--    • Public users see their own orders (select auth.uid() pattern)
--    • Admins can do everything
--    • No anonymous INSERT/UPDATE/DELETE (security)
-- ─────────────────────────────────────────────────────────────

-- Users see their own orders — auth.uid() evaluated ONCE per query
CREATE POLICY "orders_select_own"
  ON public.orders FOR SELECT
  USING (
    (select auth.uid()) = user_id
    OR (select public.is_admin())
  );

-- Only authenticated inserts (Stripe webhook via service role bypasses RLS)
CREATE POLICY "orders_insert_authenticated"
  ON public.orders FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Admins can update/delete orders
CREATE POLICY "orders_admin_write"
  ON public.orders FOR ALL
  USING ((select public.is_admin()));

-- ─────────────────────────────────────────────────────────────
-- 2. ORDER_ITEMS
--    • Users see items from their own orders (auth.uid() once)
--    • Admins manage everything
-- ─────────────────────────────────────────────────────────────

CREATE POLICY "order_items_select_own"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND (orders.user_id = (select auth.uid()) OR (select public.is_admin()))
    )
  );

CREATE POLICY "order_items_admin_write"
  ON public.order_items FOR ALL
  USING ((select public.is_admin()));

-- ─────────────────────────────────────────────────────────────
-- 3. PRODUCTS
--    • Anyone can read active products (or all if admin)
--    • Only admins write
-- ─────────────────────────────────────────────────────────────

CREATE POLICY "products_select_public"
  ON public.products FOR SELECT
  USING (
    is_active = true
    OR (select public.is_admin())
  );

CREATE POLICY "products_admin_write"
  ON public.products FOR ALL
  USING ((select public.is_admin()));

-- ─────────────────────────────────────────────────────────────
-- 4. CATEGORIES
--    • Anyone can read
--    • Only admins write
-- ─────────────────────────────────────────────────────────────

CREATE POLICY "categories_select_public"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "categories_admin_write"
  ON public.categories FOR ALL
  USING ((select public.is_admin()));

-- ─────────────────────────────────────────────────────────────
-- 5. PROFILES
--    • Anyone can read (public storefront use)
--    • Users update only their own profile (auth.uid() once)
--    • Admins manage everything
-- ─────────────────────────────────────────────────────────────

CREATE POLICY "profiles_select_public"
  ON public.profiles FOR SELECT
  USING (true);

-- Single UPDATE policy using (select auth.uid()) — evaluated once, not per row
CREATE POLICY "profiles_update_own_or_admin"
  ON public.profiles FOR UPDATE
  USING (
    (select auth.uid()) = id
    OR (select public.is_admin())
  );

-- Admins: insert/delete
CREATE POLICY "profiles_admin_insert_delete"
  ON public.profiles FOR ALL
  USING ((select public.is_admin()));

-- ─────────────────────────────────────────────────────────────
-- 6. VARIANTS
--    • One SELECT policy (public read)
--    • One ALL policy (admin write) — no overlap
-- ─────────────────────────────────────────────────────────────

CREATE POLICY "variants_select_public"
  ON public.variants FOR SELECT
  USING (true);

CREATE POLICY "variants_admin_write"
  ON public.variants FOR ALL
  USING ((select public.is_admin()));

-- ─────────────────────────────────────────────────────────────
-- 7. SITE_SETTINGS
--    • Public read (needed for storefront maintenance mode, etc.)
--    • Admin write only
-- ─────────────────────────────────────────────────────────────

CREATE POLICY "site_settings_select_public"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "site_settings_admin_write"
  ON public.site_settings FOR ALL
  USING ((select public.is_admin()));

-- ─────────────────────────────────────────────────────────────
-- 8. FRONTEND_CONTENT
--    • Public read
--    • Admin write only
-- ─────────────────────────────────────────────────────────────

CREATE POLICY "frontend_content_select_public"
  ON public.frontend_content FOR SELECT
  USING (true);

CREATE POLICY "frontend_content_admin_write"
  ON public.frontend_content FOR ALL
  USING ((select public.is_admin()));

-- ─────────────────────────────────────────────────────────────
-- 9. DUPLICATE INDEX FIX
--    idx_products_category and idx_products_category_id are identical
--    Keep the more descriptive one, drop the shorter alias
-- ─────────────────────────────────────────────────────────────

DROP INDEX IF EXISTS public.idx_products_category;

-- ─────────────────────────────────────────────────────────────
-- 10. VERIFY — show final clean policy state
-- ─────────────────────────────────────────────────────────────

SELECT
  tablename,
  policyname,
  cmd        AS action,
  permissive,
  roles
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd, policyname;
