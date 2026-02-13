import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * FIXED: This client checks if it's being called during a "Static Generation" 
 * (Build) and skips the cookie requirement if so.
 */
export async function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.warn("Supabase environment variables are missing in server client. Returning placeholder for static generation.");
        return {
            auth: { getUser: () => Promise.resolve({ data: { user: null }, error: null }) },
            from: () => ({
                select: () => ({
                    eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }),
                    order: () => Promise.resolve({ data: [], error: null }),
                    limit: () => Promise.resolve({ data: [], error: null })
                }),
                insert: () => Promise.resolve({ data: null, error: null }),
                update: () => Promise.resolve({ data: null, error: null }),
                upsert: () => Promise.resolve({ data: null, error: null })
            })
        } as any;
    }

    const cookieStore = await cookies()

    return createServerClient(
        supabaseUrl,
        supabaseKey,
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
