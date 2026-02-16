"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath, revalidateTag } from "next/cache";

// =====================================================
// FRONTEND CONTENT ACTIONS
// =====================================================

export async function updateFrontendContent(
    contentKey: string,
    contentData: any
) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("frontend_content")
        .update({
            content_data: contentData,
            updated_at: new Date().toISOString(),
        })
        .eq("content_key", contentKey)
        .select()
        .single();

    if (error) {
        console.error("Error updating frontend content:", error);
        return { success: false, error: error.message };
    }

    // Revalidate all paths to show changes immediately
    revalidatePath("/", "layout");
    revalidateTag("frontend-content");

    return { success: true, data };
}

export async function getFrontendContent(contentKey: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("frontend_content")
        .select("*")
        .eq("content_key", contentKey)
        .single();

    if (error) {
        console.error("Error fetching frontend content:", error);
        return null;
    }

    return data;
}

export async function getAllFrontendContent() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("frontend_content")
        .select("*")
        .order("content_type");

    if (error) {
        console.error("Error fetching all frontend content:", error);
        return [];
    }

    return data;
}

export async function createFrontendContent(
    contentKey: string,
    contentType: string,
    contentData: any
) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("frontend_content")
        .insert({
            content_key: contentKey,
            content_type: contentType,
            content_data: contentData,
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating frontend content:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/", "layout");
    revalidateTag("frontend-content");

    return { success: true, data };
}

export async function deleteFrontendContent(contentKey: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("frontend_content")
        .delete()
        .eq("content_key", contentKey);

    if (error) {
        console.error("Error deleting frontend content:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/", "layout");
    revalidateTag("frontend-content");

    return { success: true };
}

// =====================================================
// NAVIGATION MENU ACTIONS
// =====================================================

export async function updateNavigationMenu(menuKey: string, menuItems: any) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("navigation_menus")
        .update({
            menu_items: menuItems,
            updated_at: new Date().toISOString(),
        })
        .eq("menu_key", menuKey)
        .select()
        .single();

    if (error) {
        console.error("Error updating navigation menu:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/", "layout");
    revalidateTag("navigation");

    return { success: true, data };
}

export async function getNavigationMenu(menuKey: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("navigation_menus")
        .select("*")
        .eq("menu_key", menuKey)
        .single();

    if (error) {
        console.error("Error fetching navigation menu:", error);
        return null;
    }

    return data;
}

export async function getAllNavigationMenus() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("navigation_menus")
        .select("*")
        .order("display_order");

    if (error) {
        console.error("Error fetching navigation menus:", error);
        return [];
    }

    return data;
}

// =====================================================
// PAGE CONTENT ACTIONS
// =====================================================

export async function updatePage(slug: string, pageData: any) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("pages")
        .update({
            ...pageData,
            updated_at: new Date().toISOString(),
        })
        .eq("slug", slug)
        .select()
        .single();

    if (error) {
        console.error("Error updating page:", error);
        return { success: false, error: error.message };
    }

    revalidatePath(`/${slug}`);
    revalidatePath("/", "layout");
    revalidateTag("pages");

    return { success: true, data };
}

export async function getPage(slug: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("pages")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error) {
        console.error("Error fetching page:", error);
        return null;
    }

    return data;
}

export async function getAllPages() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("pages")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching pages:", error);
        return [];
    }

    return data;
}

export async function createPage(pageData: any) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("pages")
        .insert(pageData)
        .select()
        .single();

    if (error) {
        console.error("Error creating page:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/", "layout");
    revalidateTag("pages");

    return { success: true, data };
}

export async function deletePage(slug: string) {
    const supabase = await createClient();

    const { error } = await supabase.from("pages").delete().eq("slug", slug);

    if (error) {
        console.error("Error deleting page:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/", "layout");
    revalidateTag("pages");

    return { success: true };
}

// =====================================================
// THEME SETTINGS ACTIONS
// =====================================================

export async function updateThemeSettings(themeKey: string, settings: any) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("theme_settings")
        .update({
            ...settings,
            updated_at: new Date().toISOString(),
        })
        .eq("theme_key", themeKey)
        .select()
        .single();

    if (error) {
        console.error("Error updating theme settings:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/", "layout");
    revalidateTag("theme");

    return { success: true, data };
}

export async function getActiveTheme() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("theme_settings")
        .select("*")
        .eq("is_active", true)
        .single();

    if (error) {
        console.error("Error fetching active theme:", error);
        return null;
    }

    return data;
}

export async function getAllThemes() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("theme_settings")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching themes:", error);
        return [];
    }

    return data;
}

export async function activateTheme(themeKey: string) {
    const supabase = await createClient();

    // Deactivate all themes
    await supabase.from("theme_settings").update({ is_active: false }).neq("theme_key", "");

    // Activate the selected theme
    const { data, error } = await supabase
        .from("theme_settings")
        .update({ is_active: true })
        .eq("theme_key", themeKey)
        .select()
        .single();

    if (error) {
        console.error("Error activating theme:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/", "layout");
    revalidateTag("theme");

    return { success: true, data };
}

// =====================================================
// SITE SETTINGS ACTIONS (Enhanced)
// =====================================================

export async function updateSiteSettings(settingKey: string, settingValue: any) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("site_settings")
        .update({
            setting_value: settingValue,
            updated_at: new Date().toISOString(),
        })
        .eq("setting_key", settingKey)
        .select()
        .single();

    if (error) {
        console.error("Error updating site settings:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/", "layout");
    revalidateTag("site-settings");

    return { success: true, data };
}

export async function getSiteSettings(settingKey: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("setting_key", settingKey)
        .single();

    if (error) {
        console.error("Error fetching site settings:", error);
        return null;
    }

    return data;
}

export async function getAllSiteSettings() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .order("setting_key");

    if (error) {
        console.error("Error fetching all site settings:", error);
        return [];
    }

    return data;
}
