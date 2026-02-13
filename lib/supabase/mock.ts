
/**
 * A robust mock factory for Supabase clients during build time.
 * This prevents "TypeError: ... is not a function" when chaining methods.
 */
export function createMockSupabaseClient() {
    const mockService: any = {
        auth: {
            getUser: () => Promise.resolve({ data: { user: null }, error: null }),
            getSession: () => Promise.resolve({ data: { session: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
        },
        storage: {
            from: () => mockService,
            upload: () => Promise.resolve({ data: null, error: null }),
            getPublicUrl: () => ({ data: { publicUrl: '' } }),
        },
        from: () => mockService,
        select: () => mockService,
        insert: () => mockService,
        update: () => mockService,
        upsert: () => mockService,
        delete: () => mockService,
        eq: () => mockService,
        neq: () => mockService,
        gt: () => mockService,
        lt: () => mockService,
        gte: () => mockService,
        lte: () => mockService,
        like: () => mockService,
        ilike: () => mockService,
        is: () => mockService,
        in: () => mockService,
        contains: () => mockService,
        containedBy: () => mockService,
        range: () => mockService,
        textSearch: () => mockService,
        match: () => mockService,
        not: () => mockService,
        or: () => mockService,
        filter: () => mockService,
        order: () => mockService,
        limit: () => mockService,
        rangeAdj: () => mockService,
        single: () => mockService,
        maybeSingle: () => mockService,
        csv: () => mockService,
        // Make it "thenable" so 'await' works
        then: (onfulfilled: any) => Promise.resolve({ data: [], error: null, count: 0 }).then(onfulfilled),
        catch: (onrejected: any) => Promise.resolve({ data: [], error: null, count: 0 }).catch(onrejected),
    };

    return mockService;
}
