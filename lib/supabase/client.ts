import { createBrowserClient } from '@supabase/ssr'
import { createMockSupabaseClient } from './mock'

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        if (typeof window === 'undefined') {
            console.warn("Supabase environment variables are missing during build/static generation. Returning placeholder client.");
            return createMockSupabaseClient();
        }
        throw new Error("Missing Supabase environment variables. Please check your .env.local file.");
    }

    return createBrowserClient(
        supabaseUrl,
        supabaseKey
    )
}
