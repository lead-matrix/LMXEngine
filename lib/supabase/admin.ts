import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createMockSupabaseClient } from './mock'

/**
 * 🔐 ADMIN CLIENT (Next.js 15 compliant)
 * Uses the privileged SUPABASE_SERVICE_ROLE_KEY.
 * Use this only in Server Actions or Metadata for operations that bypass RLS
 * but still need to be aware of the user's session.
 */
export async function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        console.warn("Missing Supabase admin environment variables. Returning mock client.");
        return createMockSupabaseClient();
    }

    const cookieStore = await cookies();

    return createServerClient(
        supabaseUrl,
        serviceRoleKey,
        {
            cookies: {
                get(name: string) { return cookieStore.get(name)?.value },
                set(name: string, value: string, options: CookieOptions) {
                    try { cookieStore.set({ name, value, ...options }) } catch (e) { }
                },
                remove(name: string, options: CookieOptions) {
                    try { cookieStore.set({ name, value: '', ...options }) } catch (e) { }
                },
            },
        }
    )
}

/**
 * 🛠️ PRIVILEGED BACKEND CLIENT
 * Pure Supabase client using Service Role Key.
 * No cookie awareness. Use for background jobs or internal utilities.
 */
export function getSupabaseAdmin() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        return createMockSupabaseClient();
    }

    return createSupabaseClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}

// For backward compatibility
export const supabaseAdmin = (() => {
    if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return getSupabaseAdmin();
    }
    return {} as any;
})();
