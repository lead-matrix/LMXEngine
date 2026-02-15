-- ========================================
-- ADMIN PORTAL SETUP - COMPLETE SQL SCRIPT
-- ========================================
-- Run this script in Supabase SQL Editor to set up:
-- 1. Storage bucket for product images
-- 2. RLS policies for secure image access
-- 3. Admin user configuration
-- ========================================

-- 1. CREATE STORAGE BUCKET
-- Note: You must create the bucket manually in Supabase Dashboard → Storage
-- Bucket name: product-images
-- Public: YES
-- Then run the policies below

-- 2. ENABLE RLS ON STORAGE
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. DROP EXISTING POLICIES (if any)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update" ON storage.objects;

-- 4. CREATE STORAGE POLICIES

-- Allow anyone to view product images (public read)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-images' );

-- Allow authenticated admins to upload images
CREATE POLICY "Admin Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

-- Allow authenticated admins to delete images
CREATE POLICY "Admin Delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images' 
  AND auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

-- Allow authenticated admins to update images
CREATE POLICY "Admin Update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images' 
  AND auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

-- 5. CREATE ADMIN USER
-- Replace 'your-email@example.com' with your actual email
-- This assumes you've already signed up with this email

UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';

-- Verify admin user was created
SELECT id, email, role, created_at 
FROM profiles 
WHERE role = 'admin';

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- Check storage policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage';

-- Check admin users
SELECT 
  id,
  email,
  role,
  created_at,
  updated_at
FROM profiles 
WHERE role = 'admin';

-- ========================================
-- NOTES
-- ========================================
-- 1. Create the 'product-images' bucket in Supabase Dashboard first
-- 2. Set the bucket to PUBLIC
-- 3. Then run this script
-- 4. Replace the email in the UPDATE statement with your email
-- 5. Verify the policies and admin user were created
-- ========================================
