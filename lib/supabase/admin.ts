import { createClient } from '@supabase/supabase-js';

let supabaseAdminInstance: any = null;

export const getSupabaseAdmin = () => {
    if (supabaseAdminInstance) return supabaseAdminInstance;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
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

    supabaseAdminInstance = createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
    return supabaseAdminInstance;
};

// For backward compatibility or internal use
export const supabaseAdmin = (() => {
    // Only return if we have the keys, otherwise the proxy will handle it
    if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return getSupabaseAdmin();
    }
    return {} as any;
})();
