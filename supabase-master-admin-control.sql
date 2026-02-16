-- =====================================================
-- MASTER ADMIN CONTROL SYSTEM
-- Complete frontend customization from admin portal
-- =====================================================

-- =====================================================
-- PART 1: FRONTEND CONTENT MANAGEMENT
-- =====================================================

-- Table for managing all frontend content
CREATE TABLE IF NOT EXISTS frontend_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_key TEXT UNIQUE NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('header', 'footer', 'page', 'section', 'navigation', 'metadata', 'media')),
  content_data JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE frontend_content ENABLE ROW LEVEL SECURITY;

-- Policies for frontend_content
DROP POLICY IF EXISTS "frontend_content_public_read" ON frontend_content;
DROP POLICY IF EXISTS "frontend_content_admin_all" ON frontend_content;

-- Public can read active content
CREATE POLICY "frontend_content_public_read" ON frontend_content
  FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

-- Admins can do everything
CREATE POLICY "frontend_content_admin_all" ON frontend_content
  FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- =====================================================
-- PART 2: NAVIGATION MENU MANAGEMENT
-- =====================================================

CREATE TABLE IF NOT EXISTS navigation_menus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_key TEXT UNIQUE NOT NULL,
  menu_name TEXT NOT NULL,
  menu_items JSONB NOT NULL,
  position TEXT CHECK (position IN ('header', 'footer', 'sidebar', 'mobile')),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE navigation_menus ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "navigation_public_read" ON navigation_menus;
DROP POLICY IF EXISTS "navigation_admin_all" ON navigation_menus;

CREATE POLICY "navigation_public_read" ON navigation_menus
  FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

CREATE POLICY "navigation_admin_all" ON navigation_menus
  FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- =====================================================
-- PART 3: PAGE CONTENT MANAGEMENT
-- =====================================================

CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  meta_description TEXT,
  meta_keywords TEXT[],
  content JSONB NOT NULL,
  is_published BOOLEAN DEFAULT false,
  is_homepage BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pages_public_read" ON pages;
DROP POLICY IF EXISTS "pages_admin_all" ON pages;

CREATE POLICY "pages_public_read" ON pages
  FOR SELECT
  TO authenticated, anon
  USING (is_published = true);

CREATE POLICY "pages_admin_all" ON pages
  FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- =====================================================
-- PART 4: MEDIA LIBRARY
-- =====================================================

CREATE TABLE IF NOT EXISTS media_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  alt_text TEXT,
  caption TEXT,
  usage_context TEXT[], -- Where this media is used
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "media_public_read" ON media_library;
DROP POLICY IF EXISTS "media_admin_all" ON media_library;

CREATE POLICY "media_public_read" ON media_library
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "media_admin_all" ON media_library
  FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- =====================================================
-- PART 5: THEME CUSTOMIZATION
-- =====================================================

CREATE TABLE IF NOT EXISTS theme_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  theme_key TEXT UNIQUE NOT NULL,
  colors JSONB,
  typography JSONB,
  spacing JSONB,
  borders JSONB,
  effects JSONB,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE theme_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "theme_public_read" ON theme_settings;
DROP POLICY IF EXISTS "theme_admin_all" ON theme_settings;

CREATE POLICY "theme_public_read" ON theme_settings
  FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

CREATE POLICY "theme_admin_all" ON theme_settings
  FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- =====================================================
-- PART 6: INSERT DEFAULT DATA
-- =====================================================

-- Default Header Content
INSERT INTO frontend_content (content_key, content_type, content_data) VALUES
('header_main', 'header', '{
  "logo": {
    "url": "/logo.jpg",
    "alt": "DINA COSMETIC",
    "width": 120,
    "height": 40
  },
  "navigation": [
    {"label": "SHOP", "href": "/shop"},
    {"label": "COLLECTIONS", "href": "/collections"},
    {"label": "THE PALACE", "href": "/the-palace"},
    {"label": "ABOUT", "href": "/about"},
    {"label": "CONTACT", "href": "/contact"}
  ],
  "announcement_bar": {
    "enabled": true,
    "text": "Free Shipping on Orders Over $100",
    "background": "#D4AF37",
    "color": "#000000"
  }
}'::jsonb)
ON CONFLICT (content_key) DO NOTHING;

-- Default Footer Content
INSERT INTO frontend_content (content_key, content_type, content_data) VALUES
('footer_main', 'footer', '{
  "columns": [
    {
      "title": "THE COLLECTION",
      "links": [
        {"text": "All Products", "url": "/shop"},
        {"text": "New Arrivals", "url": "/shop?filter=new"},
        {"text": "Best Sellers", "url": "/shop?filter=bestsellers"},
        {"text": "Gift Sets", "url": "/shop?category=gifts"}
      ]
    },
    {
      "title": "THE PALACE",
      "links": [
        {"text": "Our Story", "url": "/about"},
        {"text": "Contact Us", "url": "/contact"}
      ]
    },
    {
      "title": "CUSTOMER CARE",
      "links": [
        {"text": "Shipping & Returns", "url": "/shipping"},
        {"text": "Privacy Policy", "url": "/privacy"},
        {"text": "Terms of Service", "url": "/terms"},
        {"text": "FAQ", "url": "/faq"}
      ]
    }
  ],
  "social_links": {
    "facebook": "https://facebook.com/dinacosmetic",
    "instagram": "https://instagram.com/dinacosmetic",
    "twitter": "https://twitter.com/dinacosmetic",
    "tiktok": "https://tiktok.com/@dinacosmetic",
    "youtube": "https://youtube.com/@dinacosmetic"
  },
  "copyright": "© 2026 DINA COSMETIC. All rights reserved.",
  "tagline": "The Obsidian Palace"
}'::jsonb)
ON CONFLICT (content_key) DO NOTHING;

-- Default Homepage Content
INSERT INTO pages (slug, title, meta_description, is_published, is_homepage, content) VALUES
('home', 'DINA COSMETIC | The Obsidian Palace', 'Discover premium beauty products and cosmetics at DINA COSMETIC - The Obsidian Palace.', true, true, '{
  "hero": {
    "title": "THE OBSIDIAN PALACE",
    "subtitle": "Where Luxury Meets Beauty",
    "cta_text": "EXPLORE COLLECTION",
    "cta_link": "/shop",
    "background_image": "/hero-bg.jpg"
  },
  "sections": [
    {
      "type": "featured_products",
      "title": "CURATED COLLECTION",
      "limit": 8
    },
    {
      "type": "text_block",
      "title": "CRAFTED WITH PRECISION",
      "content": "Every product in our collection is carefully selected to embody the essence of luxury and sophistication."
    }
  ]
}'::jsonb)
ON CONFLICT (slug) DO NOTHING;

-- Default Theme
INSERT INTO theme_settings (theme_key, colors, typography, is_active) VALUES
('obsidian_palace', '{
  "background": "#000000",
  "foreground": "#FFFFFF",
  "accent": "#D4AF37",
  "muted": "#18181B",
  "border": "#27272A"
}'::jsonb, '{
  "heading": "Playfair Display",
  "body": "Inter"
}'::jsonb, true)
ON CONFLICT (theme_key) DO NOTHING;

-- =====================================================
-- PART 7: UPDATE TRIGGERS
-- =====================================================

-- Trigger for frontend_content
DROP TRIGGER IF EXISTS update_frontend_content_updated_at ON frontend_content;
CREATE TRIGGER update_frontend_content_updated_at
  BEFORE UPDATE ON frontend_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for navigation_menus
DROP TRIGGER IF EXISTS update_navigation_menus_updated_at ON navigation_menus;
CREATE TRIGGER update_navigation_menus_updated_at
  BEFORE UPDATE ON navigation_menus
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for pages
DROP TRIGGER IF EXISTS update_pages_updated_at ON pages;
CREATE TRIGGER update_pages_updated_at
  BEFORE UPDATE ON pages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for theme_settings
DROP TRIGGER IF EXISTS update_theme_settings_updated_at ON theme_settings;
CREATE TRIGGER update_theme_settings_updated_at
  BEFORE UPDATE ON theme_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- PART 8: GRANT PERMISSIONS
-- =====================================================

GRANT SELECT ON frontend_content TO authenticated, anon;
GRANT SELECT ON navigation_menus TO authenticated, anon;
GRANT SELECT ON pages TO authenticated, anon;
GRANT SELECT ON media_library TO authenticated, anon;
GRANT SELECT ON theme_settings TO authenticated, anon;

GRANT ALL ON frontend_content TO authenticated;
GRANT ALL ON navigation_menus TO authenticated;
GRANT ALL ON pages TO authenticated;
GRANT ALL ON media_library TO authenticated;
GRANT ALL ON theme_settings TO authenticated;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

SELECT 'Frontend Content Table' as item,
       CASE WHEN (SELECT count(*) FROM information_schema.tables WHERE table_name = 'frontend_content') > 0 THEN '✅ EXISTS' ELSE '❌ MISSING' END as status;

SELECT 'Navigation Menus Table' as item,
       CASE WHEN (SELECT count(*) FROM information_schema.tables WHERE table_name = 'navigation_menus') > 0 THEN '✅ EXISTS' ELSE '❌ MISSING' END as status;

SELECT 'Pages Table' as item,
       CASE WHEN (SELECT count(*) FROM information_schema.tables WHERE table_name = 'pages') > 0 THEN '✅ EXISTS' ELSE '❌ MISSING' END as status;

SELECT 'Media Library Table' as item,
       CASE WHEN (SELECT count(*) FROM information_schema.tables WHERE table_name = 'media_library') > 0 THEN '✅ EXISTS' ELSE '❌ MISSING' END as status;

SELECT 'Theme Settings Table' as item,
       CASE WHEN (SELECT count(*) FROM information_schema.tables WHERE table_name = 'theme_settings') > 0 THEN '✅ EXISTS' ELSE '❌ MISSING' END as status;

-- =====================================================
-- DONE!
-- =====================================================
