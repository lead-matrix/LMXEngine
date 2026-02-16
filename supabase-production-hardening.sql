-- =====================================================
-- 🚀 PRODUCTION HARDENING & MIGRATION SCRIPT (FIXED)
-- =====================================================

-- 1️⃣ Shipping Fields for Orders
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS tracking_number text,
ADD COLUMN IF NOT EXISTS shipping_label_url text,
ADD COLUMN IF NOT EXISTS shipped_at timestamptz,
ADD COLUMN IF NOT EXISTS ip_address text,
ADD COLUMN IF NOT EXISTS user_agent text;

-- 2️⃣ Order Status Enum Enforcement (The Big Fix)
DO $$ 
BEGIN
    -- 1. Create Type if not exists
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status_enum') THEN
        CREATE TYPE order_status_enum AS ENUM (
            'pending',
            'paid',
            'processing',
            'shipped',
            'delivered',
            'cancelled',
            'refunded'
        );
    END IF;

    -- 2. DYNAMICALLY DROP ALL POLICIES accessing 'orders' column 'status'
    -- This prevents the "operator does not exist: order_status_enum = text" error
    DECLARE
        pol RECORD;
    BEGIN
        FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'orders' AND schemaname = 'public' LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON public.orders', pol.policyname);
        END LOOP;
    END;

    -- 3. DROP ALL CONSTRAINTS accessing 'orders' column 'status'
    DECLARE
        cons RECORD;
    BEGIN
        FOR cons IN 
            SELECT conname 
            FROM pg_constraint 
            WHERE conrelid = 'public.orders'::regclass 
            AND pg_get_constraintdef(oid) LIKE '%status%'
        LOOP
            EXECUTE format('ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS %I', cons.conname);
        END LOOP;
    END;

    -- 4. DROP ALL INDEXES involving 'status'
    DECLARE
        idx RECORD;
    BEGIN
        FOR idx IN 
            SELECT indexname 
            FROM pg_indexes 
            WHERE tablename = 'orders' AND schemaname = 'public' AND indexdef LIKE '%status%'
        LOOP
            EXECUTE format('DROP INDEX IF EXISTS public.%I', idx.indexname);
        END LOOP;
    END;

    -- 5. PERFORM THE CONVERSION
    -- Drop default first
    ALTER TABLE public.orders ALTER COLUMN status DROP DEFAULT;
    
    -- Change type and cast existing data
    ALTER TABLE public.orders
    ALTER COLUMN status TYPE order_status_enum
    USING status::text::order_status_enum;
    
    -- Set new default with correct cast
    ALTER TABLE public.orders ALTER COLUMN status SET DEFAULT 'pending'::order_status_enum;

END $$;

-- 3️⃣ Admin Audit Log Table
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  target_table text,
  target_id uuid,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can read all logs
DROP POLICY IF EXISTS "Admins only audit access" ON public.admin_audit_logs;
CREATE POLICY "Admins only audit access"
ON public.admin_audit_logs
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = (SELECT auth.uid()) AND role = 'admin'
  )
);

-- 4️⃣ Convert Admin RLS to Table-Based (More Secure)

-- PRODUCTS (Consolidated)
DROP POLICY IF EXISTS "Admin full access products" ON public.products;
DROP POLICY IF EXISTS "products_select" ON public.products;
DROP POLICY IF EXISTS "products_admin_all" ON public.products;
DROP POLICY IF EXISTS "products_admin_insert" ON public.products;
DROP POLICY IF EXISTS "products_admin_update" ON public.products;
DROP POLICY IF EXISTS "products_admin_delete" ON public.products;
DROP POLICY IF EXISTS "products_insert" ON public.products;
DROP POLICY IF EXISTS "products_update" ON public.products;
DROP POLICY IF EXISTS "products_delete" ON public.products;

CREATE POLICY "products_select" ON public.products FOR SELECT TO public USING (true);
CREATE POLICY "products_admin_insert" ON public.products FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));
CREATE POLICY "products_admin_update" ON public.products FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));
CREATE POLICY "products_admin_delete" ON public.products FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

-- PROFILES (Consolidated)
DROP POLICY IF EXISTS "Admin manage profiles" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_update" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_delete" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete" ON public.profiles;

-- Anyone authenticated can see profiles (to see names/emails in UI)
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT TO authenticated USING (true);
-- Admin can do the rest
CREATE POLICY "profiles_admin_insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));
CREATE POLICY "profiles_admin_update" ON public.profiles FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));
CREATE POLICY "profiles_admin_delete" ON public.profiles FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

-- CATEGORIES (Consolidated)
DROP POLICY IF EXISTS "Admin manage categories" ON public.categories;
DROP POLICY IF EXISTS "categories_select" ON public.categories;
DROP POLICY IF EXISTS "categories_admin_all" ON public.categories;
DROP POLICY IF EXISTS "categories_admin_insert" ON public.categories;
DROP POLICY IF EXISTS "categories_admin_update" ON public.categories;
DROP POLICY IF EXISTS "categories_admin_delete" ON public.categories;
DROP POLICY IF EXISTS "categories_insert" ON public.categories;
DROP POLICY IF EXISTS "categories_update" ON public.categories;
DROP POLICY IF EXISTS "categories_delete" ON public.categories;

CREATE POLICY "categories_select" ON public.categories FOR SELECT TO public USING (true);
CREATE POLICY "categories_admin_insert" ON public.categories FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));
CREATE POLICY "categories_admin_update" ON public.categories FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));
CREATE POLICY "categories_admin_delete" ON public.categories FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

-- 5️⃣ Performance Indexes & Cleanup
DROP INDEX IF EXISTS public.idx_orders_user;
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);

-- 6️⃣ Soft Delete for Products
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

-- 7️⃣ Store Settings (Kill Switch)
CREATE TABLE IF NOT EXISTS public.system_settings (
  key text PRIMARY KEY,
  value jsonb,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read settings" ON public.system_settings;
DROP POLICY IF EXISTS "Admin manage settings" ON public.system_settings;
DROP POLICY IF EXISTS "system_settings_select" ON public.system_settings;
DROP POLICY IF EXISTS "system_settings_admin_all" ON public.system_settings;
DROP POLICY IF EXISTS "system_settings_admin_insert" ON public.system_settings;
DROP POLICY IF EXISTS "system_settings_admin_update" ON public.system_settings;
DROP POLICY IF EXISTS "system_settings_admin_delete" ON public.system_settings;

CREATE POLICY "system_settings_select" ON public.system_settings FOR SELECT TO public USING (true);
CREATE POLICY "system_settings_admin_insert" ON public.system_settings FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));
CREATE POLICY "system_settings_admin_update" ON public.system_settings FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));
CREATE POLICY "system_settings_admin_delete" ON public.system_settings FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

INSERT INTO public.system_settings (key, value)
VALUES ('store_enabled', 'true'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- 8️⃣ Recreate Order Policies with correct Enum comparison (Consolidated)
DROP POLICY IF EXISTS "orders_select_combined" ON public.orders;
DROP POLICY IF EXISTS "orders_write_all" ON public.orders;
DROP POLICY IF EXISTS "orders_update_all" ON public.orders;
DROP POLICY IF EXISTS "orders_delete_all" ON public.orders;
DROP POLICY IF EXISTS "orders_select_user" ON public.orders;
DROP POLICY IF EXISTS "orders_admin_all" ON public.orders;
DROP POLICY IF EXISTS "orders_admin_insert" ON public.orders;
DROP POLICY IF EXISTS "orders_admin_update" ON public.orders;
DROP POLICY IF EXISTS "orders_admin_delete" ON public.orders;
DROP POLICY IF EXISTS "orders_insert" ON public.orders;
DROP POLICY IF EXISTS "orders_select" ON public.orders;

-- 1. Selection: User sees own, Admin sees all
CREATE POLICY "orders_select" ON public.orders FOR SELECT TO authenticated 
USING (user_id = (SELECT auth.uid()) OR EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

-- 2. Insertion: User can create own, Admin can insert
CREATE POLICY "orders_insert" ON public.orders FOR INSERT TO authenticated 
WITH CHECK (
  user_id = (SELECT auth.uid()) OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role = 'admin')
);

-- 3. Admin Management (Update/Delete)
CREATE POLICY "orders_admin_update" ON public.orders FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));
CREATE POLICY "orders_admin_delete" ON public.orders FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

-- =====================================================
-- DONE
-- =====================================================


