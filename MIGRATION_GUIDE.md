# 🗄️ Database Migration Guide

## Overview

This guide will help you run the database migration to enable the Master Admin Control System.

## Prerequisites

- ✅ Access to your Supabase project dashboard
- ✅ Admin/Owner permissions on the project
- ✅ SQL Editor access

## Migration File

**File**: `supabase-master-admin-control.sql`

**What it creates**:
- 5 new tables
- RLS policies for security
- Default data (header, footer, homepage)
- Triggers for auto-updating timestamps

## Step-by-Step Instructions

### Step 1: Open Supabase Dashboard

1. Go to [supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project

### Step 2: Navigate to SQL Editor

1. Click on "SQL Editor" in the left sidebar
2. Click "New Query" button

### Step 3: Copy Migration SQL

1. Open the file: `supabase-master-admin-control.sql`
2. Select all content (Ctrl+A or Cmd+A)
3. Copy (Ctrl+C or Cmd+C)

### Step 4: Paste and Run

1. Paste into the SQL Editor (Ctrl+V or Cmd+V)
2. Click "Run" button (or press Ctrl+Enter)
3. Wait for execution to complete

### Step 5: Verify Success

You should see output like:
```
✅ Tables created successfully
✅ Policies created successfully
✅ Default data inserted
✅ Triggers created successfully
```

### Step 6: Verify Tables

1. Go to "Table Editor" in left sidebar
2. Confirm these tables exist:
   - `frontend_content`
   - `navigation_menus`
   - `pages`
   - `media_library`
   - `theme_settings`

### Step 7: Check Default Data

1. Click on `frontend_content` table
2. You should see 2 rows:
   - `header_main`
   - `footer_main`

3. Click on `pages` table
4. You should see 1 row:
   - `home` (the homepage)

5. Click on `theme_settings` table
6. You should see 1 row:
   - `obsidian_palace` (active theme)

## What Gets Created

### Tables

#### 1. frontend_content
```sql
Columns:
- id (UUID, Primary Key)
- content_key (TEXT, Unique)
- content_type (TEXT)
- content_data (JSONB)
- is_active (BOOLEAN)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)

Default Data:
- header_main (header content)
- footer_main (footer content)
```

#### 2. navigation_menus
```sql
Columns:
- id (UUID, Primary Key)
- menu_key (TEXT, Unique)
- menu_name (TEXT)
- menu_items (JSONB)
- position (TEXT)
- display_order (INTEGER)
- is_active (BOOLEAN)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)

Default Data: None (ready for your menus)
```

#### 3. pages
```sql
Columns:
- id (UUID, Primary Key)
- slug (TEXT, Unique)
- title (TEXT)
- meta_description (TEXT)
- meta_keywords (TEXT[])
- content (JSONB)
- is_published (BOOLEAN)
- is_homepage (BOOLEAN)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)

Default Data:
- home (homepage with hero and sections)
```

#### 4. media_library
```sql
Columns:
- id (UUID, Primary Key)
- file_name (TEXT)
- file_path (TEXT)
- file_type (TEXT)
- file_size (INTEGER)
- alt_text (TEXT)
- caption (TEXT)
- usage_context (TEXT[])
- uploaded_by (UUID, FK to profiles)
- created_at (TIMESTAMPTZ)

Default Data: None (ready for your media)
```

#### 5. theme_settings
```sql
Columns:
- id (UUID, Primary Key)
- theme_key (TEXT, Unique)
- colors (JSONB)
- typography (JSONB)
- spacing (JSONB)
- borders (JSONB)
- effects (JSONB)
- is_active (BOOLEAN)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)

Default Data:
- obsidian_palace (your current theme)
```

### Security Policies

Each table has RLS policies:

**Public (anon + authenticated):**
- Can SELECT published/active content only

**Admins (authenticated with role='admin'):**
- Can SELECT, INSERT, UPDATE, DELETE everything

### Triggers

Auto-update `updated_at` timestamp on:
- frontend_content
- navigation_menus
- pages
- theme_settings

## Troubleshooting

### Error: "relation already exists"

**Solution**: Tables already exist. You can either:
1. Drop existing tables first (⚠️ loses data)
2. Skip this migration if already run

### Error: "permission denied"

**Solution**: 
1. Verify you're logged in as project owner
2. Check you have admin permissions
3. Try refreshing the dashboard

### Error: "function does not exist"

**Solution**:
1. Ensure you ran the complete `supabase-complete-setup.sql` first
2. The `update_updated_at_column()` function must exist

### Error: "syntax error"

**Solution**:
1. Ensure you copied the ENTIRE file
2. Check for any copy/paste issues
3. Try copying again

## Verification Queries

Run these to verify everything worked:

### Check Tables
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'frontend_content',
  'navigation_menus',
  'pages',
  'media_library',
  'theme_settings'
);
```

Should return 5 rows.

### Check Policies
```sql
SELECT tablename, policyname 
FROM pg_policies 
WHERE tablename IN (
  'frontend_content',
  'navigation_menus',
  'pages',
  'media_library',
  'theme_settings'
);
```

Should return multiple rows (2 policies per table).

### Check Default Data
```sql
-- Check frontend content
SELECT content_key FROM frontend_content;
-- Should show: header_main, footer_main

-- Check pages
SELECT slug FROM pages;
-- Should show: home

-- Check theme
SELECT theme_key FROM theme_settings;
-- Should show: obsidian_palace
```

## Rollback (If Needed)

If you need to undo the migration:

```sql
-- ⚠️ WARNING: This will delete all data in these tables!

DROP TABLE IF EXISTS media_library CASCADE;
DROP TABLE IF EXISTS theme_settings CASCADE;
DROP TABLE IF EXISTS pages CASCADE;
DROP TABLE IF EXISTS navigation_menus CASCADE;
DROP TABLE IF EXISTS frontend_content CASCADE;
```

## After Migration

### Next Steps

1. ✅ Migration complete
2. Go to `/admin` in your app
3. Click "Frontend" in sidebar
4. You should see the content editor
5. Make a test change
6. Save and verify it's live

### If Something's Wrong

1. Check the browser console for errors
2. Verify you're logged in as admin
3. Check your `profiles` table has `role = 'admin'`
4. Review the `SETUP_CHECKLIST.md`

## Migration Checklist

- [ ] Opened Supabase dashboard
- [ ] Navigated to SQL Editor
- [ ] Copied migration file contents
- [ ] Pasted into SQL Editor
- [ ] Clicked "Run"
- [ ] Saw success messages
- [ ] Verified tables exist
- [ ] Checked default data
- [ ] Tested admin portal access
- [ ] Made a test change
- [ ] Verified change is live

## Success!

If all checkboxes are checked, your migration is complete! 🎉

**You now have the database foundation for complete master admin control.**

---

## Quick Reference

| Action | Location |
|--------|----------|
| SQL Editor | Supabase Dashboard → SQL Editor |
| Table Editor | Supabase Dashboard → Table Editor |
| Migration File | `supabase-master-admin-control.sql` |
| Verification | Run queries above |
| Rollback | Run DROP statements (⚠️ careful!) |

---

**Next**: Follow `SETUP_CHECKLIST.md` to complete the setup.
