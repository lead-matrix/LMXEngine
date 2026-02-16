# Master Admin Control System - Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         ADMIN PORTAL                             │
│                        (/admin/*)                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Admin Actions
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SERVER ACTIONS                              │
│                 (frontend-actions.ts)                            │
│                                                                  │
│  • updateFrontendContent()  • createPage()                      │
│  • updateNavigationMenu()   • updatePage()                      │
│  • updateSiteSettings()     • deletePage()                      │
│  • updateThemeSettings()    • activateTheme()                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Database Operations
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       SUPABASE DATABASE                          │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │ frontend_content │  │ navigation_menus │                    │
│  │                  │  │                  │                    │
│  │ • header_main    │  │ • header_menu    │                    │
│  │ • footer_main    │  │ • footer_menu    │                    │
│  │ • custom_content │  │ • mobile_menu    │                    │
│  └──────────────────┘  └──────────────────┘                    │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │     pages        │  │  theme_settings  │                    │
│  │                  │  │                  │                    │
│  │ • home           │  │ • obsidian_palace│                    │
│  │ • about          │  │ • custom_themes  │                    │
│  │ • custom_pages   │  │                  │                    │
│  └──────────────────┘  └──────────────────┘                    │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │  media_library   │  │  site_settings   │                    │
│  │                  │  │                  │                    │
│  │ • images         │  │ • store_info     │                    │
│  │ • videos         │  │ • contact_info   │                    │
│  │ • documents      │  │ • social_links   │                    │
│  └──────────────────┘  └──────────────────┘                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Revalidation
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NEXT.JS CACHE                               │
│                                                                  │
│  revalidatePath("/", "layout")  ← Revalidates entire site      │
│  revalidateTag("content")       ← Revalidates specific content │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Instant Update
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      PUBLIC WEBSITE                              │
│                     (All Frontend Pages)                         │
│                                                                  │
│  • Header (from frontend_content)                               │
│  • Footer (from frontend_content)                               │
│  • Pages (from pages table)                                     │
│  • Products (from products table)                               │
│  • Theme (from theme_settings)                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Admin Makes Change

```
Admin Portal → Visual/Code Editor → Form Submission
```

### 2. Server Action Processes

```
Server Action → Validate Data → Update Database
```

### 3. Database Updates

```
Database → Row Level Security Check → Update Row → Trigger updated_at
```

### 4. Revalidation

```
Revalidation → Clear Next.js Cache → Rebuild Pages
```

### 5. Public Sees Change

```
Public Website → Fetch Fresh Data → Render Updated Content
```

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      ADMIN LAYOUT                                │
│                  (AdminLayoutClient.tsx)                         │
│                                                                  │
│  ┌────────────────┐  ┌────────────────────────────────────┐    │
│  │   Sidebar      │  │        Main Content Area           │    │
│  │                │  │                                    │    │
│  │ • Dashboard    │  │  ┌──────────────────────────────┐ │    │
│  │ • Products     │  │  │   /admin/frontend            │ │    │
│  │ • Orders       │  │  │                              │ │    │
│  │ • Users        │  │  │  • Content Selector          │ │    │
│  │                │  │  │  • Visual Editor             │ │    │
│  │ MASTER CONTROLS│  │  │  • Code Editor               │ │    │
│  │ • Frontend  ◄──┼──┼──┤  • Save Button               │ │    │
│  │ • Pages     ◄──┼──┼──┤                              │ │    │
│  │ • Settings     │  │  └──────────────────────────────┘ │    │
│  └────────────────┘  │                                    │    │
│                      │  ┌──────────────────────────────┐ │    │
│                      │  │   /admin/pages               │ │    │
│                      │  │                              │ │    │
│                      │  │  • Page List                 │ │    │
│                      │  │  • Page Editor               │ │    │
│                      │  │  • SEO Settings              │ │    │
│                      │  │  • Publish Toggle            │ │    │
│                      │  └──────────────────────────────┘ │    │
│                      └────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER REQUEST                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   NEXT.JS MIDDLEWARE                             │
│                                                                  │
│  • Check Authentication                                          │
│  • Verify Session                                                │
│  • Redirect if not logged in                                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN LAYOUT                                  │
│                                                                  │
│  • Server-side check: user.role === 'admin'                     │
│  • Redirect if not admin                                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   SERVER ACTIONS                                 │
│                                                                  │
│  • Verify user is authenticated                                  │
│  • Check admin role                                              │
│  • Execute database operation                                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                 ROW LEVEL SECURITY (RLS)                         │
│                                                                  │
│  • Verify user.id matches auth.uid()                            │
│  • Check role = 'admin' for mutations                           │
│  • Allow public read for published content                      │
│  • Deny all other operations                                    │
└─────────────────────────────────────────────────────────────────┘
```

## Database Schema Relationships

```
┌──────────────┐
│   profiles   │
│              │
│ • id (PK)    │
│ • role       │◄─────────────┐
└──────────────┘              │
                              │ Foreign Key
                              │
┌──────────────────────────────┼──────────────────────────────┐
│                              │                              │
│  ┌────────────────────┐  ┌──┴───────────────┐             │
│  │ frontend_content   │  │  media_library   │             │
│  │                    │  │                  │             │
│  │ • id (PK)          │  │ • id (PK)        │             │
│  │ • content_key      │  │ • uploaded_by ───┘             │
│  │ • content_data     │  │ • file_path                    │
│  │ • is_active        │  │ • usage_context                │
│  └────────────────────┘  └──────────────────┘             │
│                                                            │
│  ┌────────────────────┐  ┌────────────────────┐           │
│  │ navigation_menus   │  │      pages         │           │
│  │                    │  │                    │           │
│  │ • id (PK)          │  │ • id (PK)          │           │
│  │ • menu_key         │  │ • slug (UNIQUE)    │           │
│  │ • menu_items       │  │ • content          │           │
│  │ • is_active        │  │ • is_published     │           │
│  └────────────────────┘  └────────────────────┘           │
│                                                            │
│  ┌────────────────────┐  ┌────────────────────┐           │
│  │  theme_settings    │  │  site_settings     │           │
│  │                    │  │                    │           │
│  │ • id (PK)          │  │ • id (PK)          │           │
│  │ • theme_key        │  │ • setting_key      │           │
│  │ • colors           │  │ • setting_value    │           │
│  │ • is_active        │  │                    │           │
│  └────────────────────┘  └────────────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

## Revalidation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN SAVES CHANGE                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              Server Action: updateFrontendContent()              │
│                                                                  │
│  1. Update database                                              │
│  2. revalidatePath("/", "layout")                               │
│  3. revalidateTag("frontend-content")                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     NEXT.JS CACHE LAYER                          │
│                                                                  │
│  • Invalidate all pages under "/"                               │
│  • Invalidate all content with tag "frontend-content"           │
│  • Mark for regeneration on next request                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT REQUEST TO SITE                          │
│                                                                  │
│  • Fetch fresh data from database                               │
│  • Render with updated content                                  │
│  • Cache new version                                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   USER SEES UPDATED CONTENT                      │
└─────────────────────────────────────────────────────────────────┘
```

## File Structure

```
mainSmarket/
│
├── app/
│   ├── admin/
│   │   ├── actions/
│   │   │   └── frontend-actions.ts      ← Server Actions
│   │   ├── frontend/
│   │   │   └── page.tsx                 ← Frontend Customization UI
│   │   ├── pages/
│   │   │   └── page.tsx                 ← Page Builder UI
│   │   ├── products/
│   │   ├── orders/
│   │   ├── users/
│   │   ├── settings/
│   │   │   └── page.tsx                 ← Site Settings UI
│   │   ├── layout.tsx                   ← Admin Layout (Server)
│   │   └── page.tsx                     ← Dashboard
│   │
│   ├── (public pages)/
│   │   ├── shop/
│   │   ├── about/
│   │   ├── contact/
│   │   └── [dynamic]/                   ← Dynamic pages from DB
│   │
│   └── layout.tsx                       ← Root Layout
│
├── components/
│   └── admin/
│       └── AdminLayoutClient.tsx        ← Admin Sidebar & Nav
│
├── utils/
│   └── supabase/
│       └── server.ts                    ← Supabase Client
│
├── supabase-master-admin-control.sql    ← Database Migration
├── MASTER_ADMIN_GUIDE.md                ← Full Documentation
├── QUICK_START.md                       ← Quick Start Guide
├── IMPLEMENTATION_SUMMARY.md            ← Implementation Details
└── SETUP_CHECKLIST.md                   ← Setup Checklist
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                  │
│                                                                  │
│  • Next.js 15 (App Router)                                      │
│  • React 18                                                      │
│  • TypeScript                                                    │
│  • Tailwind CSS                                                  │
│  • Shadcn UI Components                                          │
│  • Lucide React Icons                                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND                                   │
│                                                                  │
│  • Next.js Server Actions                                        │
│  • Server Components                                             │
│  • API Routes                                                    │
│  • Middleware                                                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATABASE                                   │
│                                                                  │
│  • Supabase (PostgreSQL)                                         │
│  • Row Level Security (RLS)                                      │
│  • Real-time subscriptions                                       │
│  • Storage for media                                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION                                │
│                                                                  │
│  • Supabase Auth                                                 │
│  • JWT tokens                                                    │
│  • Role-based access control                                     │
└─────────────────────────────────────────────────────────────────┘
```

## Key Concepts

### 1. Server Actions
- Run on the server
- Direct database access
- Type-safe
- Automatic revalidation

### 2. Revalidation
- Instant cache invalidation
- No deployment needed
- Changes visible immediately

### 3. Row Level Security
- Database-level security
- Policy-based access control
- Automatic enforcement

### 4. Dynamic Content
- Database-driven pages
- JSON-based structure
- Flexible and scalable

### 5. Type Safety
- TypeScript throughout
- Compile-time checks
- Better developer experience

---

**This architecture provides complete control with instant updates and enterprise-level security.**
