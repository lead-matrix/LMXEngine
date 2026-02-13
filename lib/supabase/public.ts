import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Public client for use in generateStaticParams or other contexts
 * where cookies/headers are not available or needed.
 */
export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        // Log a warning instead of throwing during build if variables are missing
        console.warn("Supabase environment variables are missing in public client. Returning placeholder for static generation.");
        return {
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

    return createSupabaseClient(
        supabaseUrl,
        supabaseKey
    )
}
