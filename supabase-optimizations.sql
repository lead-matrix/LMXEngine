-- =====================================================
-- SECURITY FIXES FOR SUPABASE LINTER WARNINGS
-- =====================================================

-- =====================================================
-- FIX 1: Function Search Path Mutable
-- =====================================================

-- Fix the site_customization_set_updated_fields function
-- by setting a secure search_path

ALTER FUNCTION public.site_customization_set_updated_fields() 
SET search_path = public;

-- Verify the fix
SELECT 
    p.proname as function_name,
    pg_get_function_identity_arguments(p.oid) as arguments,
    p.prosecdef as security_definer,
    array_to_string(p.proconfig, ', ') as config_settings
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
AND p.proname = 'site_customization_set_updated_fields';

-- =====================================================
-- FIX 2: Leaked Password Protection
-- =====================================================

-- NOTE: This cannot be fixed via SQL. You must enable it in the Supabase Dashboard.
-- 
-- INSTRUCTIONS:
-- 1. Go to your Supabase Dashboard
-- 2. Navigate to Authentication → Policies
-- 3. Find "Password Strength and Leaked Password Protection"
-- 4. Enable "Leaked Password Protection"
-- 5. Save changes
--
-- This will check passwords against HaveIBeenPwned.org database
-- to prevent users from using compromised passwords.

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Check if the function search_path is now set
SELECT 
    'Function search_path fix' as check_item,
    CASE 
        WHEN array_to_string(p.proconfig, ', ') LIKE '%search_path%' 
        THEN '✅ FIXED - search_path is set'
        ELSE '❌ NOT FIXED - search_path not set'
    END as status
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
AND p.proname = 'site_customization_set_updated_fields';

-- =====================================================
-- DONE!
-- =====================================================

-- =====================================================
-- FIX 3: RLS Enabled No Policy (public.admins)
-- =====================================================

-- Table 'public.admins' has RLS enabled but no policies.
-- This effectively blocks all access to the table.
-- We will add a Service Role only policy to clear the warning
-- and ensure it remains secure (or accessible only by super admins).

-- Since we use profiles.role = 'admin', this table might be legacy or for specific use.
-- We'll add a restrictive policy.

DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'admins') THEN
        -- Drop existing policies if any (just in case)
        DROP POLICY IF EXISTS "Enable read access for authenticated users" ON "public"."admins";
        DROP POLICY IF EXISTS "admins_service_role" ON "public"."admins";
        DROP POLICY IF EXISTS "admins_admin_access" ON "public"."admins";
        
        -- Create a policy that allows everything for the service role (superuser)
        -- and specific admin access if needed.
        -- Usage: 'service_role' key or internal functions.
        CREATE POLICY "admins_service_role" ON "public"."admins"
        AS PERMISSIVE FOR ALL
        TO service_role
        USING (true)
        WITH CHECK (true);
        
        -- Optional: specific admin access if this table is actually used by app admins
        CREATE POLICY "admins_admin_access" ON "public"."admins"
        AS PERMISSIVE FOR ALL
        TO authenticated
        USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'))
        WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
    END IF;
END
$$;

-- =====================================================
-- DONE!
-- =====================================================

-- After running this SQL:
-- 1. ✅ Function search_path warning will be fixed
-- 2. ⚠️  Leaked password protection must be enabled in Dashboard
-- 3. ✅ RLS Policy added for 'admins' table
--
-- See instructions above for enabling leaked password protection.
-- =====================================================
-- PERFORMANCE FIXES V4 - FINAL OPTIMIZED
-- =====================================================
-- 1. Policies consolidated by ACTION (Select vs Modify) to fix "Multiple Permissive Policies"
-- 2. ALL auth functions wrapped in (SELECT ...) to fix "Auth RLS Initialization Plan"

-- =====================================================
-- 1. CONSOLIDATED POLICIES (Public Read + Admin Write)
-- =====================================================

-- CATEGORIES
DROP POLICY IF EXISTS "Admin full access categories" ON categories;
DROP POLICY IF EXISTS "categories_public_read" ON categories;
DROP POLICY IF EXISTS "categories_admin_all" ON categories;
DROP POLICY IF EXISTS "categories_read" ON categories;
DROP POLICY IF EXISTS "categories_select_combined" ON categories;
DROP POLICY IF EXISTS "categories_modify_admin" ON categories;
DROP POLICY IF EXISTS "categories_select" ON categories;
DROP POLICY IF EXISTS "categories_insert" ON categories;
DROP POLICY IF EXISTS "categories_update" ON categories;
DROP POLICY IF EXISTS "categories_delete" ON categories;

-- 1. SELECT (Public + Admin)
CREATE POLICY "categories_select" ON categories
  FOR SELECT
  TO public
  USING (true);

-- 2. INSERT (Admin only)
CREATE POLICY "categories_insert" ON categories
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

-- 3. UPDATE (Admin only)
CREATE POLICY "categories_update" ON categories
  FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

-- 4. DELETE (Admin only)
CREATE POLICY "categories_delete" ON categories
  FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));


-- FRONTEND CONTENT
DROP POLICY IF EXISTS "frontend_content_admin_all" ON frontend_content;
DROP POLICY IF EXISTS "frontend_content_public_read" ON frontend_content;
DROP POLICY IF EXISTS "frontend_content_read" ON frontend_content;
DROP POLICY IF EXISTS "frontend_content_select" ON frontend_content;
DROP POLICY IF EXISTS "frontend_content_insert" ON frontend_content;
DROP POLICY IF EXISTS "frontend_content_update" ON frontend_content;
DROP POLICY IF EXISTS "frontend_content_delete" ON frontend_content;

CREATE POLICY "frontend_content_select" ON frontend_content
  FOR SELECT
  TO public
  USING (
    is_active = true OR 
    (
      (SELECT auth.role()) = 'authenticated' AND 
      EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin')
    )
  );

CREATE POLICY "frontend_content_insert" ON frontend_content
  FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

CREATE POLICY "frontend_content_update" ON frontend_content
  FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

CREATE POLICY "frontend_content_delete" ON frontend_content
  FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));


-- MEDIA LIBRARY
DROP POLICY IF EXISTS "media_admin_all" ON media_library;
DROP POLICY IF EXISTS "media_public_read" ON media_library;
DROP POLICY IF EXISTS "media_read" ON media_library;
DROP POLICY IF EXISTS "media_select" ON media_library;
DROP POLICY IF EXISTS "media_insert" ON media_library;
DROP POLICY IF EXISTS "media_update" ON media_library;
DROP POLICY IF EXISTS "media_delete" ON media_library;

CREATE POLICY "media_select" ON media_library
  FOR SELECT TO public USING (true);

CREATE POLICY "media_insert" ON media_library
  FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

CREATE POLICY "media_update" ON media_library
  FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

CREATE POLICY "media_delete" ON media_library
  FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));


-- NAVIGATION MENUS
DROP POLICY IF EXISTS "navigation_admin_all" ON navigation_menus;
DROP POLICY IF EXISTS "navigation_public_read" ON navigation_menus;
DROP POLICY IF EXISTS "navigation_read" ON navigation_menus;
DROP POLICY IF EXISTS "navigation_select" ON navigation_menus;
DROP POLICY IF EXISTS "navigation_insert" ON navigation_menus;
DROP POLICY IF EXISTS "navigation_update" ON navigation_menus;
DROP POLICY IF EXISTS "navigation_delete" ON navigation_menus;

CREATE POLICY "navigation_select" ON navigation_menus
  FOR SELECT TO public 
  USING (
    is_active = true OR 
    (
      (SELECT auth.role()) = 'authenticated' AND 
      EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin')
    )
  );

CREATE POLICY "navigation_insert" ON navigation_menus
  FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

CREATE POLICY "navigation_update" ON navigation_menus
  FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

CREATE POLICY "navigation_delete" ON navigation_menus
  FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));


-- PAGES
DROP POLICY IF EXISTS "pages_admin_all" ON pages;
DROP POLICY IF EXISTS "pages_public_read" ON pages;
DROP POLICY IF EXISTS "pages_read" ON pages;
DROP POLICY IF EXISTS "pages_select" ON pages;
DROP POLICY IF EXISTS "pages_insert" ON pages;
DROP POLICY IF EXISTS "pages_update" ON pages;
DROP POLICY IF EXISTS "pages_delete" ON pages;

CREATE POLICY "pages_select" ON pages
  FOR SELECT TO public 
  USING (
    is_published = true OR 
    (
      (SELECT auth.role()) = 'authenticated' AND 
      EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin')
    )
  );

CREATE POLICY "pages_insert" ON pages
  FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

CREATE POLICY "pages_update" ON pages
  FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

CREATE POLICY "pages_delete" ON pages
  FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));


-- PRODUCTS
DROP POLICY IF EXISTS "Admin full access products" ON products;
DROP POLICY IF EXISTS "products_public_read" ON products;
DROP POLICY IF EXISTS "products_read" ON products;
DROP POLICY IF EXISTS "products_admin_all" ON products;
DROP POLICY IF EXISTS "products_select" ON products;
DROP POLICY IF EXISTS "products_insert" ON products;
DROP POLICY IF EXISTS "products_update" ON products;
DROP POLICY IF EXISTS "products_delete" ON products;

CREATE POLICY "products_select" ON products
  FOR SELECT TO public USING (true);

CREATE POLICY "products_insert" ON products
  FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

CREATE POLICY "products_update" ON products
  FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

CREATE POLICY "products_delete" ON products
  FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));


-- THEME SETTINGS
DROP POLICY IF EXISTS "theme_admin_all" ON theme_settings;
DROP POLICY IF EXISTS "theme_public_read" ON theme_settings;
DROP POLICY IF EXISTS "theme_read" ON theme_settings;
DROP POLICY IF EXISTS "theme_select" ON theme_settings;
DROP POLICY IF EXISTS "theme_insert" ON theme_settings;
DROP POLICY IF EXISTS "theme_update" ON theme_settings;
DROP POLICY IF EXISTS "theme_delete" ON theme_settings;

CREATE POLICY "theme_select" ON theme_settings
  FOR SELECT TO public 
  USING (
    is_active = true OR 
    (
      (SELECT auth.role()) = 'authenticated' AND 
      EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin')
    )
  );

CREATE POLICY "theme_insert" ON theme_settings
  FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

CREATE POLICY "theme_update" ON theme_settings
  FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

CREATE POLICY "theme_delete" ON theme_settings
  FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));


-- =====================================================
-- 2. USER + ADMIN ACCESS TABLES (Already fixed in V2)
-- =====================================================

-- ORDERS (Already split in V2)
-- Keeping existing logic, just re-affirming drop if exists to clear bad states if any
DROP POLICY IF EXISTS "orders_select_combined" ON orders;
DROP POLICY IF EXISTS "orders_admin_write" ON orders;
DROP POLICY IF EXISTS "orders_admin_modify" ON orders;
DROP POLICY IF EXISTS "orders_admin_delete" ON orders;

CREATE POLICY "orders_select_combined" ON orders
  FOR SELECT
  TO authenticated
  USING (
    user_id = (SELECT auth.uid()) OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin')
  );

CREATE POLICY "orders_admin_write" ON orders
  FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));
  
CREATE POLICY "orders_admin_modify" ON orders
  FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));
  
CREATE POLICY "orders_admin_delete" ON orders
  FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));


-- ORDER ITEMS
DROP POLICY IF EXISTS "order_items_admin_all" ON order_items;
DROP POLICY IF EXISTS "Users read own order items" ON order_items;
DROP POLICY IF EXISTS "order_items_select_combined" ON order_items;
DROP POLICY IF EXISTS "order_items_admin_insert" ON order_items;
DROP POLICY IF EXISTS "order_items_admin_update" ON order_items;
DROP POLICY IF EXISTS "order_items_admin_delete" ON order_items;

CREATE POLICY "order_items_select_combined" ON order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = (SELECT auth.uid())) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin')
  );

CREATE POLICY "order_items_admin_insert" ON order_items
  FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

CREATE POLICY "order_items_admin_update" ON order_items
  FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

CREATE POLICY "order_items_admin_delete" ON order_items
  FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));


-- PROFILES
DROP POLICY IF EXISTS "profiles_admin_all" ON profiles;
DROP POLICY IF EXISTS "profiles_read_all" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_select_combined" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_combined" ON profiles;
DROP POLICY IF EXISTS "profiles_update_combined" ON profiles;
DROP POLICY IF EXISTS "profiles_delete_admin" ON profiles;

CREATE POLICY "profiles_select_combined" ON profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "profiles_insert_combined" ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    id = (SELECT auth.uid()) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin')
  );

CREATE POLICY "profiles_update_combined" ON profiles
  FOR UPDATE
  TO authenticated
  USING (
    id = (SELECT auth.uid()) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin')
  );

CREATE POLICY "profiles_delete_admin" ON profiles
  FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

-- =====================================================
-- 3. INDEX OPTIMIZATIONS
-- =====================================================

-- Fix for "Unindexed foreign keys" warning
-- Table: public.media_library, Column: uploaded_by
CREATE INDEX IF NOT EXISTS "idx_media_library_uploaded_by" ON media_library(uploaded_by);

-- Note: "Unused Index" warnings have been noted but are NOT automatically removed.
-- It is better to keep them until production traffic patterns indicate they are truly unnecessary.

-- =====================================================
-- VERIFICATION
-- =====================================================
SELECT tablename, policyname, permissive, roles, cmd FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename;