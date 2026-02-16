# Master Admin Control System

## Overview

The Master Admin Control System gives you complete control over your entire storefront from the admin portal. Any changes you make are instantly live and visible to all visitors.

## Features

### 1. **Frontend Customization** (`/admin/frontend`)
Control all frontend content including:
- Header configuration (logo, navigation, announcement bar)
- Footer content (columns, links, social media)
- Homepage sections
- Any custom frontend sections

**How it works:**
- Visual Editor: Edit content through form fields
- Code Editor: Direct JSON editing for advanced users
- Instant Publishing: Changes go live immediately after saving

### 2. **Page Builder** (`/admin/pages`)
Create and manage all pages on your site:
- Create new pages with custom URLs
- Edit existing pages
- Set SEO metadata (title, description, keywords)
- Publish/unpublish pages
- Set homepage

**Page Structure:**
Pages use JSON to define their structure. Example:
```json
{
  "hero": {
    "title": "Welcome",
    "subtitle": "Your tagline",
    "cta_text": "Shop Now",
    "cta_link": "/shop"
  },
  "sections": [
    {
      "type": "featured_products",
      "title": "Best Sellers",
      "limit": 8
    }
  ]
}
```

### 3. **Product Management** (`/admin/products`)
Full control over your product catalog:
- Add/edit/delete products
- Upload product images
- Manage variants (sizes, colors, etc.)
- Set pricing and inventory
- Instant live updates

### 4. **Site Settings** (`/admin/settings`)
Configure global site settings:
- Store information
- Contact details
- Social media links
- Footer configuration

## Database Schema

### Tables Created

1. **frontend_content**
   - Stores all customizable frontend content
   - Supports header, footer, page sections, navigation, metadata, and media
   - Public can read, admins can modify

2. **navigation_menus**
   - Manages all navigation menus
   - Supports header, footer, sidebar, and mobile menus
   - Configurable display order

3. **pages**
   - Dynamic page management
   - Full SEO support
   - JSON-based content structure
   - Publish/draft status

4. **media_library**
   - Centralized media management
   - Track usage context
   - Alt text and captions

5. **theme_settings**
   - Theme customization
   - Colors, typography, spacing
   - Multiple themes support

## Setup Instructions

### 1. Run the Database Migration

Execute the SQL migration in your Supabase SQL Editor:

```bash
# The file is located at:
supabase-master-admin-control.sql
```

Copy and paste the entire contents into your Supabase SQL Editor and run it.

### 2. Verify Installation

After running the migration, check that all tables were created:
- frontend_content
- navigation_menus
- pages
- media_library
- theme_settings

### 3. Access the Admin Portal

Navigate to `/admin` and you'll see the new sections:
- **Frontend** - Customize all frontend content
- **Pages** - Build and manage pages
- **Products** - Manage your catalog
- **Settings** - Configure site settings

## How to Use

### Customizing the Header

1. Go to `/admin/frontend`
2. Select `header_main` from the sidebar
3. Edit the content:
   - Logo URL and dimensions
   - Navigation links
   - Announcement bar text and colors
4. Click "Save & Publish"
5. Changes are instantly live!

### Customizing the Footer

1. Go to `/admin/frontend`
2. Select `footer_main` from the sidebar
3. Edit:
   - Footer columns and links
   - Social media URLs
   - Copyright text
   - Tagline
4. Save and it's live immediately

### Creating a New Page

1. Go to `/admin/pages`
2. Click "New Page"
3. Fill in:
   - Page Title
   - URL Slug (e.g., "about-us")
   - Meta Description
   - Content (JSON structure)
4. Toggle "Published" to make it live
5. Save

### Editing Products

1. Go to `/admin/products`
2. Click on any product to edit
3. Update:
   - Name, description, price
   - Images (drag & drop)
   - Variants
   - Stock levels
4. Save - changes are live instantly

## Technical Details

### Server Actions

All admin actions use Next.js Server Actions with instant revalidation:

```typescript
// Example: Updating frontend content
await updateFrontendContent(contentKey, newData);
// Automatically revalidates the entire site
```

### Revalidation Strategy

Every save action triggers:
```typescript
revalidatePath("/", "layout");  // Revalidates all pages
revalidateTag("frontend-content"); // Revalidates specific content
```

This ensures all changes are immediately visible to visitors.

### Security

- All admin actions require authentication
- Only users with `role = 'admin'` can access
- Row Level Security (RLS) policies enforce permissions
- Public can only read published content

## API Reference

### Frontend Content Actions

```typescript
// Get all frontend content
const content = await getAllFrontendContent();

// Update specific content
await updateFrontendContent(contentKey, contentData);

// Create new content
await createFrontendContent(contentKey, contentType, contentData);

// Delete content
await deleteFrontendContent(contentKey);
```

### Page Actions

```typescript
// Get all pages
const pages = await getAllPages();

// Get specific page
const page = await getPage(slug);

// Create page
await createPage(pageData);

// Update page
await updatePage(slug, pageData);

// Delete page
await deletePage(slug);
```

### Site Settings Actions

```typescript
// Get all settings
const settings = await getAllSiteSettings();

// Update setting
await updateSiteSettings(settingKey, settingValue);
```

## Best Practices

1. **Always Preview**: Use the preview button before publishing major changes
2. **Backup Content**: Export your JSON content before major edits
3. **Use Descriptive Keys**: Name your content keys clearly (e.g., `homepage_hero` not `h1`)
4. **Test on Mobile**: Check how changes look on mobile devices
5. **SEO Optimization**: Always fill in meta descriptions and keywords for pages

## Troubleshooting

### Changes Not Showing Up?

1. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
2. Check if the content is marked as "active" or "published"
3. Verify you're logged in as admin

### JSON Errors?

1. Use the Code Editor's built-in validation
2. Check for missing commas or brackets
3. Use a JSON validator online if needed

### Permission Errors?

1. Verify your user has `role = 'admin'` in the profiles table
2. Check RLS policies are enabled
3. Ensure you're logged in

## Future Enhancements

Potential additions to the system:
- Visual drag-and-drop page builder
- A/B testing for different page versions
- Scheduled publishing
- Content versioning and rollback
- Multi-language support
- Advanced media management with folders

## Support

For issues or questions:
1. Check the Supabase logs for errors
2. Review the browser console for client-side errors
3. Verify database policies and permissions
4. Check that all migrations ran successfully

---

**Remember**: With great power comes great responsibility. You now have master access to your entire storefront. Any change you make is instantly live to all visitors!
