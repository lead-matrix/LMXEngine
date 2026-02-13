import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Public client for use in generateStaticParams or other contexts
 * where cookies/headers are not available or needed.
 */
export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        throw new Error("Missing Supabase environment variables. Please check your .env.local file.");
    }

    return createSupabaseClient(
        supabaseUrl,
        supabaseKey
    )
}
